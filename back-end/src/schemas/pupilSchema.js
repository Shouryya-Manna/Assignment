const { z } = require('zod');

// Custom validation functions
const isValidPhoneNumber = (phone) => {
  if (!phone || phone.trim() === '') return true; // Optional field
  // UK phone number validation - basic format check
  const phoneRegex = /^(\+44|0)[1-9]\d{8,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100;
};

// Nested schema for contact information
const contactSchema = z.object({
  mobile: z.string()
    .optional()
    .refine(isValidPhoneNumber, {
      message: 'Invalid mobile phone number format'
    }),
  work: z.string()
    .optional()
    .refine(isValidPhoneNumber, {
      message: 'Invalid work phone number format'
    })
}).optional();

// Nested schema for address objects
const addressSchema = z.object({
  postcode: z.string()
    .optional()
    .refine((postcode) => {
      if (!postcode || postcode.trim() === '') return true;
      // UK postcode validation - basic format
      const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
      return postcodeRegex.test(postcode.trim());
    }, {
      message: 'Invalid UK postcode format'
    }),
  houseNo: z.string().optional(),
  address: z.string().optional()
}).optional();

// Main pupil validation schema for creation
const pupilCreateSchema = z.object({
  // Required fields as per Requirement 5.1
  forename: z.string()
    .min(1, 'Forename is required')
    .max(50, 'Forename must be less than 50 characters')
    .trim(),
  surname: z.string()
    .min(1, 'Surname is required')
    .max(50, 'Surname must be less than 50 characters')
    .trim(),
  dob: z.string()
    .refine(isValidDate, {
      message: 'Invalid date format. Use YYYY-MM-DD format'
    })
    .refine((dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 16 && age <= 100; // Reasonable age range for driving pupils
    }, {
      message: 'Age must be between 16 and 100 years'
    }),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Gender must be Male, Female, or Other' })
  }),

  // Optional personal details
  title: z.enum(['Mr', 'Mrs', 'Miss', 'Ms', 'Dr']).optional(),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')), // Allow empty string

  // Contact information - nested schema
  home: contactSchema,
  allowTextMessaging: z.boolean().optional().default(false),

  // Address objects - nested schemas as per Requirement 5.2
  pickupAddress: addressSchema,
  homeAddress: addressSchema,

  // Enum validations as per Requirements 5.3 and 5.4
  pupilType: z.enum(['Manual Gearbox', 'Automatic', 'Motorcycle', 'HGV'], {
    errorMap: () => ({ message: 'Invalid pupil type' })
  }).optional().default('Manual Gearbox'),
  
  pupilOwner: z.string().optional().default('Instructor'),
  allocatedTo: z.string().optional(),
  
  licenseType: z.enum(['No License', 'Provisional', 'Full License'], {
    errorMap: () => ({ message: 'Invalid license type' })
  }).optional().default('No License'),
  
  licenseNo: z.string().optional(),

  // Boolean fields as per Requirement 5.5
  passedTheory: z.boolean().optional().default(false),
  fott: z.boolean().optional().default(false),
  fullAccess: z.boolean().optional().default(false),
  pupilCaution: z.boolean().optional().default(false),

  // Date fields as per Requirement 5.6
  certNo: z.string().optional(),
  datePassed: z.string()
    .optional()
    .nullable()
    .refine((dateString) => {
      if (!dateString) return true; // Optional field
      return isValidDate(dateString);
    }, {
      message: 'Invalid date format for date passed. Use YYYY-MM-DD format'
    }),

  // Additional fields
  usualAvailability: z.string().optional(),
  discount: z.string().optional().default('0%'),
  defaultProduct: z.string().optional(),
  onlinePassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
});
// Schema for partial updates (PUT operations) - all fields optional except validation rules
const pupilUpdateSchema = z.object({
  // Personal details - all optional for updates
  title: z.enum(['Mr', 'Mrs', 'Miss', 'Ms', 'Dr']).optional(),
  forename: z.string()
    .min(1, 'Forename cannot be empty if provided')
    .max(50, 'Forename must be less than 50 characters')
    .trim()
    .optional(),
  surname: z.string()
    .min(1, 'Surname cannot be empty if provided')
    .max(50, 'Surname must be less than 50 characters')
    .trim()
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')), // Allow empty string
  dob: z.string()
    .refine(isValidDate, {
      message: 'Invalid date format. Use YYYY-MM-DD format'
    })
    .refine((dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 16 && age <= 100;
    }, {
      message: 'Age must be between 16 and 100 years'
    })
    .optional(),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Gender must be Male, Female, or Other' })
  }).optional(),

  // Contact information
  home: contactSchema,
  allowTextMessaging: z.boolean().optional(),

  // Address objects
  pickupAddress: addressSchema,
  homeAddress: addressSchema,

  // Enum fields
  pupilType: z.enum(['Manual Gearbox', 'Automatic', 'Motorcycle', 'HGV'], {
    errorMap: () => ({ message: 'Invalid pupil type' })
  }).optional(),
  
  pupilOwner: z.string().optional(),
  allocatedTo: z.string().optional(),
  
  licenseType: z.enum(['No License', 'Provisional', 'Full License'], {
    errorMap: () => ({ message: 'Invalid license type' })
  }).optional(),
  
  licenseNo: z.string().optional(),

  // Boolean fields
  passedTheory: z.boolean().optional(),
  fott: z.boolean().optional(),
  fullAccess: z.boolean().optional(),
  pupilCaution: z.boolean().optional(),

  // Date and text fields
  certNo: z.string().optional(),
  datePassed: z.string()
    .optional()
    .nullable()
    .refine((dateString) => {
      if (!dateString) return true;
      return isValidDate(dateString);
    }, {
      message: 'Invalid date format for date passed. Use YYYY-MM-DD format'
    }),

  usualAvailability: z.string().optional(),
  discount: z.string().optional(),
  defaultProduct: z.string().optional(),
  onlinePassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
});

// MongoDB ObjectId validation schema
const objectIdSchema = z.string().refine((id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
}, {
  message: 'Invalid MongoDB ObjectId format'
});

module.exports = {
  pupilCreateSchema,
  pupilUpdateSchema,
  contactSchema,
  addressSchema,
  objectIdSchema
};