"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { pupilSchema } from "@/schemas/Schema";
import type { Pupil } from "@/schemas/Schema";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDownIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useUpdatePupil } from "@/api/Mutations";
import { usePupil } from "@/api/Queries";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const EditPupil = () => {
  const { id } = useParams<{ id: string }>();
  const updatePupil = useUpdatePupil(id!);
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);
  const [dobOpen, setDobOpen] = useState(false);
  const [datePassedOpen, setDatePassedOpen] = useState(false);
  // fetch the pupil data by id
  const { data: pupil, isLoading, isError, error } = usePupil(id!);

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
  });

  // when data arrives, reset form with fetched pupil data
  useEffect(() => {
    console.log(pupil);
    if (pupil) {
      form.reset({
        ...pupil,
        dob: pupil.dob ? new Date(pupil.dob) : undefined,
        datePassed: pupil.datePassed ? new Date(pupil.datePassed) : undefined,
      });
    }
  }, [pupil, form]);

  const onSubmit = (data: Pupil) => {
    updatePupil.mutate(data, {
      onSuccess: () => {
        setSuccessOpen(true); // show dialog
        // Delay navigation
        setTimeout(() => {
          setSuccessOpen(false);
          navigate("/pupils");
        }, 2000); // 2s delay, adjust as you like
      },
      onError: (err: any) => {
        const backendMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong.";
        toast.error("Failed to update pupil", { description: backendMsg });
      },
    });
  };

  if (isLoading) return <div>Loading pupil...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const renderSelect = (
    field: any,
    placeholder: string,
    options: { value: string; label: string }[]
  ) => {
    const v = field.value ?? "";
    const label = v || "";
    return (
      <Select
        key={v || "empty"}
        onValueChange={field.onChange}
        value={v || undefined}
        defaultValue={v || undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>{label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="flex justify-center py-16 pt-16 bg-gradient-to-br from-cream-50 to-cream-100 min-h-screen">
      <Card className="w-full max-w-5xl  backdrop-blur-sm bg-white/95 border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-8">
          <CardTitle className="[font-family:var(--font-inter)] text-4xl font-bold text-center">
            Edit Pupil
          </CardTitle>
          <CardDescription className="font-sans text-indigo-100 text-center text-lg mt-2">
            Update the pupil's details below
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <h3 className="[font-family:var(--font-inter)] text-2xl font-semibold text-indigo-900 border-b border-indigo-200 pb-2">
                  Basic Information
                </h3>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Title
                        </FormLabel>
                        <FormControl>
                          {renderSelect(field, "Select title", [
                            { value: "Mr", label: "Mr" },
                            { value: "Mrs", label: "Mrs" },
                            { value: "Miss", label: "Miss" },
                            { value: "Ms", label: "Ms" },
                            { value: "Dr", label: "Dr" },
                          ])}
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
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Gender
                        </FormLabel>
                        <FormControl>
                          {renderSelect(field, "Select gender", [
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                          ])}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="forename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Forename
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter forename"
                            {...field}
                            className="h-12"
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
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Surname
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter surname"
                            {...field}
                            className="h-12"
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
                      <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Popover open={dobOpen} onOpenChange={setDobOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="dob-date"
                                className="justify-between font-normal h-12"
                              >
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <Calendar
                                mode="single"
                                selected={field.value as Date | undefined}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date);
                                    setDobOpen(false);
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
              </div>

              <div className="space-y-6">
                <h3 className="[font-family:var(--font-inter)] text-2xl font-semibold text-indigo-900 border-b border-indigo-200 pb-2">
                  Contact Information
                </h3>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="home.mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Mobile
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter mobile number"
                            {...field}
                            className="h-12"
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
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Work
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter work number"
                            {...field}
                            className="h-12"
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
                    <FormItem className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          className="w-5 h-5"
                        />
                      </FormControl>
                      <FormLabel className="mb-0 [font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                        Allow Text Messaging
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <h3 className="[font-family:var(--font-inter)] text-2xl font-semibold text-indigo-900 border-b border-indigo-200 pb-2">
                  Address Information
                </h3>

                {/* Pickup & Home Addresses */}
                <div className="grid grid-cols-2 gap-8">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
                    <CardTitle className="[font-family:var(--font-inter)] text-xl font-semibold mb-4 text-blue-900">
                      Pickup Address
                    </CardTitle>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="pickupAddress.postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-blue-800">
                              Postcode
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Postcode"
                                {...field}
                                className=" border-blue-200 h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pickupAddress.houseNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-blue-800">
                              House No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="House No."
                                {...field}
                                className=" border-blue-200 h-11"
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
                            <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-blue-800">
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Address"
                                {...field}
                                className=" border-blue-200 h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200 shadow-lg">
                    <CardTitle className="[font-family:var(--font-inter)] text-xl font-semibold mb-4 text-green-900">
                      Home Address
                    </CardTitle>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="homeAddress.postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-green-800">
                              Postcode
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Postcode"
                                {...field}
                                className=" border-green-200 h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="homeAddress.houseNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-green-800">
                              House No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="House No."
                                {...field}
                                className=" border-green-200 h-11"
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
                            <FormLabel className="[font-family:var(--font-inter)] text-base font-medium text-green-800">
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Address"
                                {...field}
                                className=" border-green-200 h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="[font-family:var(--font-inter)] text-2xl font-semibold text-indigo-900 border-b border-indigo-200 pb-2">
                  Pupil Details
                </h3>

                {/* Pupil Details */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pupilType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Pupil Type
                        </FormLabel>
                        <FormControl>
                          {renderSelect(field, "Select type", [
                            {
                              value: "Manual Gearbox",
                              label: "Manual Gearbox",
                            },
                            { value: "Automatic", label: "Automatic" },
                            { value: "Motorcycle", label: "Motorcycle" },
                            { value: "HGV", label: "HGV" },
                          ])}
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
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Pupil Owner
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Owner name"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="allocatedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Allocated To
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Allocated to"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          License Type
                        </FormLabel>
                        <FormControl>
                          {renderSelect(field, "Select type", [
                            { value: "No License", label: "No License" },
                            { value: "Provisional", label: "Provisional" },
                            { value: "Full License", label: "Full License" },
                          ])}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="licenseNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          License No.
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="License number"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passedTheory"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-4 mt-6 bg-indigo-50 rounded-xl">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                            className="w-5 h-5"
                          />
                        </FormControl>
                        <FormLabel className="mb-0 [font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Passed Theory
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="certNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Cert No.
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Certificate No."
                            {...field}
                            className="h-12"
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
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Date Passed
                        </FormLabel>
                        <FormControl>
                          <Popover
                            open={datePassedOpen}
                            onOpenChange={setDatePassedOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date-passed"
                                className="w-full justify-between font-normal rounded-xl border-2 h-12"
                              >
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value instanceof Date
                                    ? field.value
                                    : field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  if (date) field.onChange(date);
                                  setDatePassedOpen(false);
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
              </div>

              <div className="space-y-6">
                <h3 className="[font-family:var(--font-inter)] text-2xl font-semibold text-indigo-900 border-b border-indigo-200 pb-2">
                  Additional Settings
                </h3>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fott"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                            className="w-5 h-5"
                          />
                        </FormControl>
                        <FormLabel className="mb-0 [font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          FOTT
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fullAccess"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                            className="w-5 h-5"
                          />
                        </FormControl>
                        <FormLabel className="mb-0 [font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Full Access
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="usualAvailability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Usual Availability
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Availability"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Discount
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0%"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="defaultProduct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Default Product
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Product"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onlinePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                          Online Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pupilCaution"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-4 bg-red-300 rounded-xl border-2 border-red-200">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          className="w-5 h-5"
                        />
                      </FormControl>
                      <FormLabel className="mb-0 [font-family:var(--font-inter)] text-lg font-medium text-red-600">
                        Pupil Caution
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
                      <FormLabel className="[font-family:var(--font-inter)] text-lg font-medium text-gray-700">
                        Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter notes"
                          {...field}
                          className="min-h-[120px]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg [font-family:var(--font-inter)] font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-lg transition-all duration-200 transform"
                >
                  Update Pupil
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-8 z-50 rounded-2xl bg-white shadow-2xl text-center border-0">
            <DialogHeader>
              <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
              <DialogTitle className="[font-family:var(--font-inter)] text-2xl font-bold text-gray-900">
                Successfully Updated
              </DialogTitle>
              <DialogDescription className="font-sans text-gray-600 text-lg mt-2">
                The pupil's information has been updated successfully.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center mt-6">
              <Button
                onClick={() => setSuccessOpen(false)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl [font-family:var(--font-inter)] font-semibold"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default EditPupil;
