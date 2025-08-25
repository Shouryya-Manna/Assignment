"use client"

import type React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { usePupil } from "@/api/Queries"

// Shadcn UI & Lucide React Imports
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
} from "lucide-react"

const DetailItem = ({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType
  label: string
  value?: string | boolean | null | number
  children?: React.ReactNode
}) => {
  const displayValue = value === undefined || value === null || value === "" ? "-" : String(value)

  return (
    <div className="group flex items-center space-x-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-muted-foreground [font-family:var(--font-inter)] mb-1">{label}</div>
        <div className="text-base font-semibold text-foreground [font-family:var(--font-inter)] truncate">{children || displayValue}</div>
      </div>
    </div>
  )
}

const ViewPupil: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: pupil, isLoading, isError, error } = usePupil(id!)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading pupil details...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-destructive mx-auto" />
          <p className="text-destructive font-medium">Error: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!pupil) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <User className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Pupil not found.</p>
        </div>
      </div>
    )
  }

  const pupilInitials = `${pupil.forename?.[0] || ""}${pupil.surname?.[0] || ""}`.toUpperCase()

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-auto">
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-10 flex-shrink-0 text-center">
          <div className="flex flex-col items-center gap-8 mb-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                  <AvatarImage />
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary [font-family:var(--font-inter)]">
                    {pupilInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-background"></div>
              </div>
              <div className="space-y-3 text-center">
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text [font-family:var(--font-inter)]">
                  {pupil.forename} {pupil.surname}
                </h1>
                <div className="flex items-center justify-center gap-3 text-muted-foreground">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted">
                    <Mail className="h-3 w-3" />
                  </div>
                  <span className="font-medium text-base [font-family:var(--font-inter)]">{pupil.email || "No email provided"}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/pupils")}
              className="shadow-sm px-6 py-3 font-medium [font-family:var(--font-inter)]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pupils
            </Button>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </div>

        <div className="space-y-10">
          <div className="w-full max-w-5xl mx-auto">
            <Tabs defaultValue="personal" className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="h-14 p-1.5 w-full max-w-3xl rounded-xl">
                  <TabsTrigger value="personal" className="font-medium text-base [font-family:var(--font-inter)] rounded-lg">
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="font-medium text-base [font-family:var(--font-inter)] rounded-lg">
                    Contact & Address
                  </TabsTrigger>
                  <TabsTrigger value="license" className="font-medium text-base [font-family:var(--font-inter)] rounded-lg">
                    License & Notes
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1">
                <TabsContent value="personal" className="h-full">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl [font-family:var(--font-inter)]">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        Personal Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem icon={Hash} label="Pupil ID" value={pupil._id} />
                        <DetailItem icon={User} label="Title" value={pupil.title} />
                        <DetailItem icon={User} label="Forename" value={pupil.forename} />
                        <DetailItem icon={User} label="Surname" value={pupil.surname} />
                        <DetailItem
                          icon={Calendar}
                          label="Date of Birth"
                          value={pupil.dob ? new Date(pupil.dob).toLocaleDateString() : "—"}
                        />
                        <DetailItem icon={Users} label="Gender" value={pupil.gender} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contact" className="h-full">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm h-full rounded-2xl">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-2xl [font-family:var(--font-inter)]">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        Contact & Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-10 flex-1 flex flex-col justify-between px-8 pb-8">
                      <div className="space-y-10 w-full">
                        <div>
                          <h3 className="font-semibold text-xl mb-6 flex items-center gap-3 [font-family:var(--font-inter)]">
                            <Phone className="h-5 w-5 text-primary" />
                            Phone Numbers
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem icon={Phone} label="Mobile Phone" value={pupil.home?.mobile} />
                            <DetailItem icon={Phone} label="Work Phone" value={pupil.home?.work} />
                          </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

                        <div>
                          <h3 className="font-semibold text-xl mb-6 flex items-center gap-3 [font-family:var(--font-inter)]">
                            <Home className="h-5 w-5 text-primary" />
                            Addresses
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                              <h4 className="font-medium text-lg text-muted-foreground border-b pb-3 [font-family:var(--font-inter)]">
                                Pickup Address
                              </h4>
                              <div className="space-y-4">
                                <DetailItem icon={Home} label="Address" value={pupil.pickupAddress?.address} />
                                <DetailItem icon={Hash} label="House No" value={pupil.pickupAddress?.houseNo} />
                                <DetailItem icon={Mail} label="Postcode" value={pupil.pickupAddress?.postcode} />
                              </div>
                            </div>
                            <div className="space-y-6">
                              <h4 className="font-medium text-lg text-muted-foreground border-b pb-3 [font-family:var(--font-inter)]">
                                Home Address
                              </h4>
                              <div className="space-y-4">
                                <DetailItem icon={Home} label="Address" value={pupil.homeAddress?.address} />
                                <DetailItem icon={Hash} label="House No" value={pupil.homeAddress?.houseNo} />
                                <DetailItem icon={Mail} label="Postcode" value={pupil.homeAddress?.postcode} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1"></div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="license" className="h-full">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-2xl [font-family:var(--font-inter)]">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        License & Other Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem icon={Car} label="License No" value={pupil.licenseNo} />
                        <DetailItem icon={BadgeCent} label="Theory Cert No" value={pupil.certNo} />
                        <DetailItem
                          icon={Calendar}
                          label="Date Theory Passed"
                          value={pupil.datePassed ? new Date(pupil.datePassed).toLocaleDateString("en-GB") : "-"}
                        />
                        <DetailItem icon={ShieldQuestion} label="FOTT" value={pupil.fott} />
                        <DetailItem icon={KeyRound} label="Full Access" value={pupil.fullAccess ? "Yes" : "No"} />
                        <DetailItem icon={Percent} label="Discount" value={pupil.discount} />
                        <DetailItem icon={ShoppingBag} label="Default Product" value={pupil.defaultProduct} />
                        <DetailItem icon={KeyRound} label="Online Password" value={pupil.onlinePassword} />
                        <DetailItem icon={FileText} label="Usual Availability" value={pupil.usualAvailability} />
                        <div className="md:col-span-2 mt-6">
                          <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                            <DetailItem icon={FileText} label="Notes" value={pupil.notes} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="w-full max-w-5xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl [font-family:var(--font-inter)]">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  Key Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group flex items-center space-x-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-muted-foreground [font-family:var(--font-inter)] mb-1">Pupil Type</div>
                      <div className="text-base font-semibold text-foreground">
                        <Badge variant="secondary" className="font-medium text-sm [font-family:var(--font-inter)]">
                          {pupil.pupilType || "-"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center space-x-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-muted-foreground [font-family:var(--font-inter)] mb-1">License Type</div>
                      <div className="text-base font-semibold text-foreground">
                        <Badge className="font-medium text-sm [font-family:var(--font-inter)]">{pupil.licenseType || "-"}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center space-x-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-muted-foreground [font-family:var(--font-inter)] mb-1">Theory Status</div>
                      <div className="text-base font-semibold text-foreground">
                        {pupil.passedTheory ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-sm [font-family:var(--font-inter)]">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Passed
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-sm [font-family:var(--font-inter)]">
                            <XCircle className="h-4 w-4 mr-1" /> Not Passed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <DetailItem icon={UserCheck} label="Pupil Owner" value={pupil.pupilOwner} />
                  <DetailItem icon={Users} label="Allocated To" value={pupil.allocatedTo} />
                </div>

                {pupil.pupilCaution && (
                  <div className="mt-8">
                    <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-xl">
                      <Siren className="h-5 w-5" />
                      <AlertTitle className="font-semibold text-base [font-family:var(--font-inter)]">Pupil Caution</AlertTitle>
                      <AlertDescription className="mt-2 font-medium text-base [font-family:var(--font-inter)]">
                        {pupil.pupilCaution}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPupil
