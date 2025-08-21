import React from "react";
import { useSelectedPupil } from "@/context/SelectedRowContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, Mail, Phone, Home, FileText } from "lucide-react";
import type { Pupil } from "@/schemas/schema";
import { Separator } from "@radix-ui/react-select";

const PupilDetails: React.FC = () => {
  const { selectedPupil, clearSelectedPupil } = useSelectedPupil();
  const navigate = useNavigate();

  if (!selectedPupil) {
    return <div className="text-red-500">No pupil selected!</div>;
  }

  const pupil: Pupil = selectedPupil;

  const display = (val?: string | boolean | null) =>
    val === undefined || val === null ? "-" : String(val);

  const FieldRow = ({ label, value, icon }: { label: string; value?: string | boolean | null; icon?: React.ReactNode }) => (
    <div className="flex justify-between items-center w-full border-b border-muted-foreground/20 py-1">
      <div className="flex items-center space-x-1 font-medium text-muted-foreground">
        {icon} <span>{label}</span>
      </div>
      <div className="text-right">{display(value)}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      {/* Personal Details */}
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Basic information about the pupil</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <FieldRow label="ID" value={pupil._id} />
          <FieldRow label="Title" value={pupil.title} />
          <FieldRow label="Forename" value={pupil.forename} />
          <FieldRow label="Surname" value={pupil.surname} />
          <FieldRow label="Email" value={pupil.email} icon={<Mail size={16} />} />
          <FieldRow label="DOB" value={pupil.dob ? new Date(pupil.dob).toLocaleDateString("en-GB") : "-"} icon={<Calendar size={16} />} />
          <FieldRow label="Gender" value={pupil.gender} />
        </CardContent>
      </Card>

      <Separator />

      {/* Contact Details */}
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <FieldRow label="Mobile" value={pupil.home?.mobile} icon={<Phone size={16} />} />
          <FieldRow label="Work" value={pupil.home?.work} icon={<Phone size={16} />} />
          <FieldRow label="Allow Text Messaging" value={pupil.allowTextMessaging} />
        </CardContent>
      </Card>

      <Separator />

      {/* Addresses */}
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <FieldRow label="Pickup Address" value={pupil.pickupAddress?.address} icon={<Home size={16} />} />
          <FieldRow label="House No" value={pupil.pickupAddress?.houseNo} />
          <FieldRow label="Postcode" value={pupil.pickupAddress?.postcode} />
          <FieldRow label="Home Address" value={pupil.homeAddress?.address} icon={<Home size={16} />} />
          <FieldRow label="House No" value={pupil.homeAddress?.houseNo} />
          <FieldRow label="Postcode" value={pupil.homeAddress?.postcode} />
        </CardContent>
      </Card>

      <Separator />

      {/* Extra Details */}
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Extra Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <FieldRow label="Pupil Type" value={pupil.pupilType} />
          <FieldRow label="Pupil Owner" value={pupil.pupilOwner} />
          <FieldRow label="Allocated To" value={pupil.allocatedTo} />
          <FieldRow label="License Type" value={pupil.licenseType} />
          <FieldRow label="License No" value={pupil.licenseNo} />
          <FieldRow label="Passed Theory" value={pupil.passedTheory} />
          <FieldRow label="Cert No" value={pupil.certNo} />
          <FieldRow label="Date Passed" value={pupil.datePassed ? new Date(pupil.datePassed).toLocaleDateString("en-GB") : "-"} icon={<Calendar size={16} />} />
          <FieldRow label="FOTT" value={pupil.fott} />
          <FieldRow label="Full Access" value={pupil.fullAccess} />
          <FieldRow label="Usual Availability" value={pupil.usualAvailability} />
          <FieldRow label="Discount" value={pupil.discount} />
          <FieldRow label="Default Product" value={pupil.defaultProduct} />
          <FieldRow label="Online Password" value={pupil.onlinePassword} />
          <FieldRow label="Pupil Caution" value={pupil.pupilCaution} />
          <div className="flex items-center space-x-2 border-b border-muted-foreground/20 py-1">
            <FileText size={16} />
            <span className="font-medium text-muted-foreground">Notes:</span>
            <span className="ml-auto">{display(pupil.notes)}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          clearSelectedPupil();
          navigate("/pupils");
        }}
      >
        Back
      </Button>
    </div>
  );
};

export default PupilDetails;
