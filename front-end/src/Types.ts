export type FormFields = {
  // Personal Details
  title?: "Mr" | "Mrs" | "Miss" | "Ms" | "Dr";
  forename: string;
  surname: string;
  email?: string;
  dob: Date;
  gender: "Male" | "Female" | "Other";

  // Contact Information
  home?: {
    mobile?: string;
    work?: string;
  };
  allowTextMessaging: boolean;

  // Addresses
  pickupAddress?: {
    postcode?: string;
    houseNo?: string;
    address?: string;
  };
  homeAddress?: {
    postcode?: string;
    houseNo?: string;
    address?: string;
  };

  // Extra Details
  pupilType: "Manual Gearbox" | "Automatic" | "Motorcycle" | "HGV";
  pupilOwner?: string;
  allocatedTo?: string;
  licenseType: "No License" | "Provisional" | "Full License";
  licenseNo?: string;
  passedTheory: boolean;
  certNo?: string;
  datePassed?: Date;
  fott: boolean;
  fullAccess: boolean;
  usualAvailability?: string;
  discount: string;
  defaultProduct?: string;
  onlinePassword?: string;
  pupilCaution: boolean;
  notes?: string;
};