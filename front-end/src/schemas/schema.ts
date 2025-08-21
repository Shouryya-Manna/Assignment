import { z } from "zod";

// Helper for ISO date string validation and not in future
const isoDateStringPast = z
  .string()
  .refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: "Please enter a valid date in YYYY-MM-DD format." }
  )
  .refine(
    (val) => !val || new Date(val) <= new Date(),
    { message: "Date of birth cannot be in the future." }
  );

const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;

export const pupilSchema = z.object({
  // Personal Details
  _id: z.string(),
  title: z.enum(["Mr", "Mrs", "Miss", "Ms", "Dr"]).optional(),
  forename: z.string().min(1, { message: "Forename is required." }).max(50, { message: "Forename cannot exceed 50 characters." }),
  surname: z.string().min(1, { message: "Surname is required." }).max(50, { message: "Surname cannot exceed 50 characters." }),
  email: z.email({ message: "Please enter a valid email address." }).optional(),
  dob: isoDateStringPast,
  gender: z.enum(["Male", "Female", "Other"]),

  // Contact Information
  home: z.object({
    mobile: z.string()
      .regex(phoneRegex, { message: "Please enter a valid phone number (7-15 digits)." })
      .optional(),
    work: z.string()
      .regex(phoneRegex, { message: "Please enter a valid phone number (7-15 digits)." })
      .optional(),
  }).optional(),

  allowTextMessaging: z.boolean().optional(),

  // Addresses
  pickupAddress: z.object({
    postcode: z.string()
      .regex(/^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i, { message: "Please enter a valid UK postcode." })
      .optional(),
    houseNo: z.string().optional(),
    address: z.string().optional(),
  }).optional(),

  homeAddress: z.object({
    postcode: z.string()
      .regex(/^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i, { message: "Please enter a valid UK postcode." })
      .optional(),
    houseNo: z.string().optional(),
    address: z.string().optional(),
  }).optional(),

  // Extra Details
  pupilType: z.enum(["Manual Gearbox", "Automatic", "Motorcycle", "HGV"]).optional(),
  pupilOwner: z.string().optional(),
  allocatedTo: z.string().optional(),
  licenseType: z.enum(["No License", "Provisional", "Full License"]).optional(),
  licenseNo: z.string().optional(),
  passedTheory: z.boolean().optional(),
  certNo: z.string().optional(),
  datePassed: z.string()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      { message: "Please enter a valid date in YYYY-MM-DD format." }
    )
    .optional(),
  fott: z.boolean().optional(),
  fullAccess: z.boolean().optional(),
  usualAvailability: z.string().optional(),
  discount: z.string().optional(),
  defaultProduct: z.string().optional(),
  onlinePassword: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
  pupilCaution: z.boolean().optional(),
  notes: z.string().max(1000, { message: "Notes cannot exceed 1000 characters." }).optional(),
});

// TypeScript type inference
export type Pupil = z.infer<typeof pupilSchema>;