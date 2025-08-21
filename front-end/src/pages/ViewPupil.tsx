import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePupil } from "@/api/Queries";
import type { Pupil } from "@/schemas/schema";

// Shadcn UI & Lucide React Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Siren,
  User,
  Mail,
  Calendar,
  Hash,
  Home,
  Phone,
  Car,
  FileText,
  BadgeCent,
  KeyRound,
  BookOpen,
  CheckCircle2,
  XCircle,
  Percent,
  ShoppingBag,
  Info,
  UserCheck,
  Users,
  ShieldQuestion,
} from "lucide-react";

// Reusable component for displaying a detail item with an icon
const DetailItem = ({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | boolean | null | number;
  children?: React.ReactNode;
}) => {
  const displayValue =
    value === undefined || value === null || value === "" ? "-" : String(value);

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center text-sm text-muted-foreground">
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </div>
      <div className="text-md font-medium pl-6">{children || displayValue}</div>
    </div>
  );
};

const PupilDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: pupil, isLoading, isError, error } = usePupil(id!);

  if (isLoading) {
    return <div className="p-8 text-center">Loading pupil details...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">Error: {error.message}</div>
    );
  }

  if (!pupil) {
    return <div className="p-8 text-center">Pupil not found.</div>;
  }

  // Helper to format dates consistently
  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString("en-GB") : "-";
  };

  const pupilInitials = `${pupil.forename?.[0] || ""}${
    pupil.surname?.[0] || ""
  }`.toUpperCase();

  return (
    <main className="p-4 md:p-8 space-y-6 bg-muted/20 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage />
            <AvatarFallback className="text-2xl">
              {pupilInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {pupil.forename} {pupil.surname}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{pupil.email || "No email provided"}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate("/pupils")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pupils
        </Button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN: KEY INFO --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem icon={Info} label="Pupil Type">
                <Badge variant="secondary">{pupil.pupilType || "-"}</Badge>
              </DetailItem>
              <DetailItem icon={Car} label="License Type">
                <Badge>{pupil.licenseType || "-"}</Badge>
              </DetailItem>
              <DetailItem icon={BookOpen} label="Theory Status">
                {pupil.passedTheory ? (
                  <Badge variant="success">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Passed
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-4 w-4 mr-1" /> Not Passed
                  </Badge>
                )}
              </DetailItem>
              <DetailItem
                icon={UserCheck}
                label="Pupil Owner"
                value={pupil.pupilOwner}
              />
              <DetailItem
                icon={Users}
                label="Allocated To"
                value={pupil.allocatedTo}
              />
            </CardContent>
          </Card>
          {pupil.pupilCaution && (
            <Alert variant="destructive">
              <Siren className="h-4 w-4" />
              <AlertTitle>Pupil Caution</AlertTitle>
              <AlertDescription>{pupil.pupilCaution}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* --- RIGHT COLUMN: TABS --- */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact & Address</TabsTrigger>
              <TabsTrigger value="license">License & Notes</TabsTrigger>
            </TabsList>

            {/* PERSONAL TAB */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailItem icon={Hash} label="Pupil ID" value={pupil._id} />
                  <DetailItem icon={User} label="Title" value={pupil.title} />
                  <DetailItem
                    icon={User}
                    label="Forename"
                    value={pupil.forename}
                  />
                  <DetailItem
                    icon={User}
                    label="Surname"
                    value={pupil.surname}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Date of Birth"
                    value={formatDate(pupil.dob)}
                  />
                  <DetailItem
                    icon={Users}
                    label="Gender"
                    value={pupil.gender}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* CONTACT & ADDRESS TAB */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailItem
                      icon={Phone}
                      label="Mobile Phone"
                      value={pupil.home?.mobile}
                    />
                    <DetailItem
                      icon={Phone}
                      label="Work Phone"
                      value={pupil.home?.work}
                    />
                  </div>
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Pickup Address</h3>
                      <div className="space-y-4 pl-2 border-l-2">
                        <DetailItem
                          icon={Home}
                          label="Address"
                          value={pupil.pickupAddress?.address}
                        />
                        <DetailItem
                          icon={Hash}
                          label="House No"
                          value={pupil.pickupAddress?.houseNo}
                        />
                        <DetailItem
                          icon={Mail}
                          label="Postcode"
                          value={pupil.pickupAddress?.postcode}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Home Address</h3>
                      <div className="space-y-4 pl-2 border-l-2">
                        <DetailItem
                          icon={Home}
                          label="Address"
                          value={pupil.homeAddress?.address}
                        />
                        <DetailItem
                          icon={Hash}
                          label="House No"
                          value={pupil.homeAddress?.houseNo}
                        />
                        <DetailItem
                          icon={Mail}
                          label="Postcode"
                          value={pupil.homeAddress?.postcode}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LICENSE & NOTES TAB */}
            <TabsContent value="license">
              <Card>
                <CardHeader>
                  <CardTitle>License & Other Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailItem
                    icon={Car}
                    label="License No"
                    value={pupil.licenseNo}
                  />
                  <DetailItem
                    icon={BadgeCent}
                    label="Theory Cert No"
                    value={pupil.certNo}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Date Theory Passed"
                    value={
                      pupil.datePassed
                        ? new Date(pupil.datePassed).toLocaleDateString("en-GB")
                        : "-"
                    }
                  />
                  <DetailItem
                    icon={ShieldQuestion}
                    label="FOTT"
                    value={pupil.fott}
                  />
                  <DetailItem
                    icon={KeyRound}
                    label="Full Access"
                    value={pupil.fullAccess ? "Yes" : "No"}
                  />
                  <DetailItem
                    icon={Percent}
                    label="Discount"
                    value={pupil.discount}
                  />
                  <DetailItem
                    icon={ShoppingBag}
                    label="Default Product"
                    value={pupil.defaultProduct}
                  />
                  <DetailItem
                    icon={KeyRound}
                    label="Online Password"
                    value={pupil.onlinePassword}
                  />
                  <DetailItem
                    icon={FileText}
                    label="Usual Availability"
                    value={pupil.usualAvailability}
                  />
                  <div className="md:col-span-2">
                    <DetailItem
                      icon={FileText}
                      label="Notes"
                      value={pupil.notes}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default PupilDetails;
