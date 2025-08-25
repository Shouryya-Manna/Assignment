"use client"

import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { pupilSchema } from "@/schemas/Schema"
import type { Pupil } from "@/schemas/Schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { usePupilMutation } from "@/api/Mutations"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircleIcon, ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const AddPupil = () => {
  const navigate = useNavigate()
  const [successOpen, setSuccessOpen] = useState(false)
  const [dobOpen, setDobOpen] = useState(false)
  const [datePassedOpen, setDatePassedOpen] = useState(false)

  const form = useForm<Pupil>({
    resolver: zodResolver(pupilSchema),
    mode: "onChange",
    defaultValues: {
      title: "Mr",
      forename: "",
      surname: "",
      email: "",
      dob: new Date(),
      gender: "Male",
      home: { mobile: "", work: "" },
      allowTextMessaging: false,
      pickupAddress: { postcode: "", houseNo: "", address: "" },
      homeAddress: { postcode: "", houseNo: "", address: "" },
      pupilType: "Manual Gearbox",
      pupilOwner: "",
      allocatedTo: "",
      licenseType: "No License",
      licenseNo: "",
      passedTheory: false,
      certNo: "",
      datePassed: new Date(),
      fott: false,
      fullAccess: false,
      usualAvailability: "",
      discount: "0%",
      defaultProduct: "",
      onlinePassword: "",
      pupilCaution: false,
      notes: "",
    },
  })

  const pupilMutation = usePupilMutation()

  const onSubmit: SubmitHandler<Pupil> = (data) => {
    pupilMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Pupil Created", {
          description: "Your pupil has been added successfully.",
        })
        setSuccessOpen(true) // show dialog
        // Delay navigation
        setTimeout(() => {
          setSuccessOpen(false)
          navigate("/pupils")
        }, 2000) // 2s delay, adjust as you like
        form.reset()
      },
      onError: (err: any) => {
        const backendMsg = err?.response?.data?.message || err?.message || "Something went wrong."
        toast.error("Failed to create pupil", {
          description: backendMsg,
        })
      },
    })
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-amber-50 via-cream-100 to-rose-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="[font-family:var(--font-inter)] text-5xl font-bold text-slate-800 mb-4">Create New Pupil</h1>
          <p className="font-sans text-lg text-slate-600 max-w-2xl mx-auto">
            Enter the pupil's comprehensive details to begin their driving journey with our academy
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="space-y-8">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="[font-family:var(--font-inter)] text-2xl font-semibold text-slate-800 mb-2">Personal Information</h2>
                    <p className="font-sans text-slate-600">Basic details about the pupil</p>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Title</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 rounded-xl border-slate-300 font-sans">
                                <SelectValue placeholder="Select title" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="Mr">Mr</SelectItem>
                                <SelectItem value="Mrs">Mrs</SelectItem>
                                <SelectItem value="Miss">Miss</SelectItem>
                                <SelectItem value="Ms">Ms</SelectItem>
                                <SelectItem value="Dr">Dr</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Gender</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 rounded-xl border-slate-300 font-sans">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="forename"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Forename</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter forename"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Surname</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter surname"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email address"
                            className="h-12 rounded-xl border-slate-300 font-sans"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Date of Birth</FormLabel>
                        <FormControl>
                          <Popover open={dobOpen} onOpenChange={setDobOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full md:w-64 h-12 justify-between font-sans rounded-xl border-slate-300 bg-transparent"
                              >
                                {field.value ? new Date(field.value).toLocaleDateString() : "Select date of birth"}
                                <ChevronDownIcon className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 mt-2 rounded-xl shadow-lg" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value as Date | undefined}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date)
                                    setDobOpen(false)
                                  }
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-8">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="[font-family:var(--font-inter)] text-2xl font-semibold text-slate-800 mb-2">Contact Information</h2>
                    <p className="font-sans text-slate-600">Phone numbers and communication preferences</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="home.mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            Mobile Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter mobile number"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="home.work"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Work Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter work number"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="allowTextMessaging"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked)}
                            className="rounded-md"
                          />
                        </FormControl>
                        <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700 mb-0">
                          Allow Text Messaging
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-8">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="[font-family:var(--font-inter)] text-2xl font-semibold text-slate-800 mb-2">Address Information</h2>
                    <p className="font-sans text-slate-600">Pickup and home address details</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 rounded-2xl p-6">
                      <CardTitle className="[font-family:var(--font-inter)] text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Pickup Address
                      </CardTitle>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="pickupAddress.postcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="[font-family:var(--font-inter)] text-sm font-medium text-slate-700">Postcode</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Postcode"
                                  className="h-10 rounded-lg border-slate-300 font-sans bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="pickupAddress.houseNo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="[font-family:var(--font-inter)] text-sm font-medium text-slate-700">
                                  House No.
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="House No."
                                    className="h-10 rounded-lg border-slate-300 font-sans bg-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pickupAddress.address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="[font-family:var(--font-inter)] text-sm font-medium text-slate-700">Street</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Street name"
                                    className="h-10 rounded-lg border-slate-300 font-sans bg-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl p-6">
                      <CardTitle className="[font-family:var(--font-inter)] text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Home Address
                      </CardTitle>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="homeAddress.postcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="[font-family:var(--font-inter)] text-sm font-medium text-slate-700">Postcode</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Postcode"
                                  className="h-10 rounded-lg border-slate-300 font-sans bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="homeAddress.houseNo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="[font-family:var(--font-inter)] text-sm font-medium text-slate-700">
                                  House No.
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="House No."
                                    className="h-10 rounded-lg border-slate-300 font-sans bg-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="homeAddress.address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="[font-family:var(--font-inter)] text-sm font-medium text-slate-700">Street</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Street name"
                                    className="h-10 rounded-lg border-slate-300 font-sans bg-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="[font-family:var(--font-inter)] text-2xl font-semibold text-slate-800 mb-2">Learning Details</h2>
                    <p className="font-sans text-slate-600">Pupil type, instructor allocation, and preferences</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pupilType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Pupil Type</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 rounded-xl border-slate-300 font-sans">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="Manual Gearbox">Manual Gearbox</SelectItem>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                                <SelectItem value="HGV">HGV</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pupilOwner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Pupil Owner</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Owner name"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="allocatedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            Allocated To
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Instructor name"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="usualAvailability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            Usual Availability
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Weekends, Evenings"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="[font-family:var(--font-inter)] text-2xl font-semibold text-slate-800 mb-2">License Information</h2>
                    <p className="font-sans text-slate-600">Current license status and theory test details</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="licenseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            License Type
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 rounded-xl border-slate-300 font-sans">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="No License">No License</SelectItem>
                                <SelectItem value="Provisional">Provisional</SelectItem>
                                <SelectItem value="Full License">Full License</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="licenseNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            License Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="License number"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="certNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            Theory Certificate Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Certificate number"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="datePassed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            Theory Test Date Passed
                          </FormLabel>
                          <FormControl>
                            <Popover open={datePassedOpen} onOpenChange={setDatePassedOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full h-12 justify-between font-sans rounded-xl border-slate-300 bg-transparent"
                                >
                                  {field.value ? new Date(field.value).toLocaleDateString() : "Select date passed"}
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 mt-2 rounded-xl shadow-lg" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value as Date | undefined}
                                  captionLayout="dropdown"
                                  onSelect={(date) => {
                                    if (date) {
                                      field.onChange(date)
                                      setDatePassedOpen(false)
                                    }
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="passedTheory"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked)}
                            className="rounded-md"
                          />
                        </FormControl>
                        <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700 mb-0">
                          Has Passed Theory Test
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-8">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="[font-family:var(--font-inter)] text-2xl font-semibold text-slate-800 mb-2">Additional Settings</h2>
                    <p className="font-sans text-slate-600">Pricing, access permissions, and special requirements</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">Discount</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 10%"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="defaultProduct"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                            Default Product
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Default lesson package"
                              className="h-12 rounded-xl border-slate-300 font-sans"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="onlinePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                          Online Portal Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password for online access"
                            type="password"
                            className="h-12 rounded-xl border-slate-300 font-sans"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fott"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked)}
                              className="rounded-md"
                            />
                          </FormControl>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700 mb-0">
                            FOTT (First Time Driver)
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fullAccess"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked)}
                              className="rounded-md"
                            />
                          </FormControl>
                          <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700 mb-0">
                            Full System Access
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pupilCaution"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked)}
                            className="rounded-md border-amber-400"
                          />
                        </FormControl>
                        <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-amber-800 mb-0">
                          Pupil Requires Special Attention
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-slate-700">
                          Additional Notes
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes about the pupil..."
                            className="min-h-24 rounded-xl border-slate-300 font-sans resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-8">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white [font-family:var(--font-inter)] text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={pupilMutation.isPending}
                  >
                    {pupilMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Pupil...</span>
                      </div>
                    ) : (
                      "Create Pupil Profile"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-8 z-50 rounded-2xl bg-white shadow-2xl text-center border-0">
            <DialogHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="text-green-600 w-8 h-8" />
              </div>
              <DialogTitle className="[font-family:var(--font-inter)] text-2xl font-bold text-slate-800">
                Pupil Created Successfully
              </DialogTitle>
              <DialogDescription className="font-sans text-slate-600 text-base">
                The new pupil profile has been added to your system and is now visible in the pupils table.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center mt-6">
              <Button
                onClick={() => setSuccessOpen(false)}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white [font-family:var(--font-inter)] rounded-xl"
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}

export default AddPupil
