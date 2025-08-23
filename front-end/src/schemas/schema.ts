import { z } from "zod";

const phoneRegex = /^[\d\s\-\+\(\)]+$/;

export const pupilSchema = z.object({
  // Personal Details
  _id: z.string().optional(),
  title: z.enum(["Mr", "Mrs", "Miss", "Ms", "Dr"]).optional(),
  forename: z
    .string()
    .min(1, { message: "Forename is required." })
    .max(50, { message: "Forename cannot exceed 50 characters." }),
  surname: z
    .string()
    .min(1, { message: "Surname is required." })
    .max(50, { message: "Surname cannot exceed 50 characters." }),
  email: z.email({ message: "Please enter a valid email address." }).optional(),
  dob: z
    .date()
    .max(new Date(), { message: "Date of birth cannot be in the future" }),
  gender: z.enum(["Male", "Female", "Other"]),

  // Contact Information
  home: z.object({
    mobile: z.string().refine((val) => phoneRegex.test(val), {
      message: "Enter a valid number",
    }),
    work: z
      .string()
      .min(1, { message: "Work number is required" })
      .refine((val) => phoneRegex.test(val), {
        message: "Invalid work number format",
      }),
  }),

  allowTextMessaging: z.boolean().optional(),

  // Addresses
  pickupAddress: z
    .object({
      postcode: z
        .string()
        .regex(/^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i, {
          message: "Please enter a valid UK postcode.",
        })
        .optional(),
      houseNo: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),

  homeAddress: z
    .object({
      postcode: z
        .string()
        .regex(/^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i, {
          message: "Please enter a valid UK postcode.",
        })
        .optional(),
      houseNo: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),

  // Extra Details
  pupilType: z
    .enum(["Manual Gearbox", "Automatic", "Motorcycle", "HGV"])
    .optional(),
  pupilOwner: z.string().optional(),
  allocatedTo: z.string().optional(),
  licenseType: z.enum(["No License", "Provisional", "Full License"]).optional(),
  licenseNo: z.string().optional(),
  passedTheory: z.boolean().optional(),
  certNo: z.string().optional(),
  datePassed: z
    .date()
    .max(new Date(), { message: "Date of birth cannot be in the future" }),
  fott: z.boolean().optional(),
  fullAccess: z.boolean().optional(),
  usualAvailability: z.string().optional(),
  discount: z.string().optional(),
  defaultProduct: z.string().optional(),
  onlinePassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional(),
  pupilCaution: z.boolean().optional(),
  notes: z
    .string()
    .max(1000, { message: "Notes cannot exceed 1000 characters." })
    .optional(),
});

// TypeScript type inference
export type Pupil = z.infer<typeof pupilSchema>;
