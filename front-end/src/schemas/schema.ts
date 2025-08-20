import { z } from "zod";

// Zod schema for pupil
export const pupilSchema = z.object({
  title: z.enum(["Mr", "Mrs", "Miss", "Ms", "Dr"]).optional(),
  forename: z.string().min(2, {
    message: "Forename must be at least 2 characters.",
  }),
  surname: z
    .string()
    .min(1, "Surname is required")
    .max(50, "Surname cannot exceed 50 characters"),
  email: z.string(), // allow empty email
  dob: z.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  home: z
    .object({
      mobile: z
        .string()
        .regex(/^[\d\s\-\+\(\)]*$/, "Invalid mobile number format")
        .optional()
        .or(z.literal("")),
      work: z
        .string()
        .regex(/^[\d\s\-\+\(\)]*$/, "Invalid work number format")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
  allowTextMessaging: z.boolean(),
  pickupAddress: z
    .object({
      postcode: z
        .string()
        .regex(
          /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i,
          "Invalid UK postcode format"
        )
        .optional()
        .or(z.literal("")),
      houseNo: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  homeAddress: z
    .object({
      postcode: z
        .string()
        .regex(
          /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i,
          "Invalid UK postcode format"
        )
        .optional()
        .or(z.literal("")),
      houseNo: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  pupilType: z.enum(["Manual Gearbox", "Automatic", "Motorcycle", "HGV"]),
  pupilOwner: z.string().optional(),
  allocatedTo: z.string().optional(),
  licenseType: z.enum(["No License", "Provisional", "Full License"]),
  licenseNo: z.string().optional(),
  passedTheory: z.boolean(),
  certNo: z.string().optional(),
  datePassed: z.date(),
  fott: z.boolean(),
  fullAccess: z.boolean(),
  usualAvailability: z.string().optional(),
  discount: z.string(),
  defaultProduct: z.string().optional(),
  onlinePassword: z.string().optional(),
  pupilCaution: z.boolean(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

// TypeScript type inference
export type Pupil = z.infer<typeof pupilSchema>;
