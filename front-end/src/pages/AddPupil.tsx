import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { pupilSchema } from "@/schemas/schema";
import type { Pupil } from "@/schemas/schema";
import { Button } from "@/components/ui/button";
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
import { usePupilMutation } from "@/api/Mutations";
import { toast } from "sonner";

const AddPupil = () => {
  const form = useForm<Pupil>({
    resolver: zodResolver(pupilSchema),
    defaultValues: {
      title: "Mr",
      forename: "",
      surname: "",
      email: "",
      dob: new Date().toISOString().substring(0, 10), // ISO string for date input
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
      datePassed: "", // empty string for optional date
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

  const pupilMutation = usePupilMutation();
  const onSubmit: SubmitHandler<Pupil> = (data) => {
    console.log(data);
    pupilMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Event Created", {
          description: "Your event has been added successfully.",
        });
        form.reset();
      },
      onError: (err) => {
        toast.error("Failed to create event", {
          description: err.message || "Something went wrong.",
        });
      },
    });
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Create Pupil</CardTitle>
          <CardDescription>Enter the pupil's details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                          <SelectContent>
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
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="forename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forename</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter forename" {...field} />
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
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter surname" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="home.mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
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
                      <FormLabel>Work</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter work number" {...field} />
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
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Allow Text Messaging</FormLabel>
                    <FormMessage /> 
                  </FormItem>
                )}
              />

              {/* Pickup & Home Addresses */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gray-50 p-4 rounded-md">
                  <CardTitle className="text-sm font-semibold mb-2">
                    Pickup Address
                  </CardTitle>
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="pickupAddress.postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input placeholder="Postcode" {...field} />
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
                          <FormLabel>House No.</FormLabel>
                          <FormControl>
                            <Input placeholder="House No." {...field} />
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
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Address" {...field} />
                          </FormControl>
                          <FormMessage /> 
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="bg-gray-50 p-4 rounded-md">
                  <CardTitle className="text-sm font-semibold mb-2">
                    Home Address
                  </CardTitle>
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="homeAddress.postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input placeholder="Postcode" {...field} />
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
                          <FormLabel>House No.</FormLabel>
                          <FormControl>
                            <Input placeholder="House No." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="homeAddress.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Address" {...field} />
                          </FormControl>
                          <FormMessage /> 
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </div>

              {/* Pupil Details */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pupilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pupil Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual Gearbox">
                              Manual Gearbox
                            </SelectItem>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Motorcycle">
                              Motorcycle
                            </SelectItem>
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
                      <FormLabel>Pupil Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="Owner name" {...field} />
                      </FormControl>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allocatedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocated To</FormLabel>
                      <FormControl>
                        <Input placeholder="Allocated to" {...field} />
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
                      <FormLabel>License Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No License">
                              No License
                            </SelectItem>
                            <SelectItem value="Provisional">
                              Provisional
                            </SelectItem>
                            <SelectItem value="Full License">
                              Full License
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licenseNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License No.</FormLabel>
                      <FormControl>
                        <Input placeholder="License number" {...field} />
                      </FormControl>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passedTheory"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                      <FormLabel className="mb-0">Passed Theory</FormLabel>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="certNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cert No.</FormLabel>
                      <FormControl>
                        <Input placeholder="Certificate No." {...field} />
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
                      <FormLabel>Date Passed</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fott"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                      <FormLabel className="mb-0">FOTT</FormLabel>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullAccess"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                      <FormLabel className="mb-0">Full Access</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="usualAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usual Availability</FormLabel>
                      <FormControl>
                        <Input placeholder="Availability" {...field} />
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
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input placeholder="0%" {...field} />
                      </FormControl>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="defaultProduct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Product</FormLabel>
                      <FormControl>
                        <Input placeholder="Product" {...field} />
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
                      <FormLabel>Online Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
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
                name="pupilCaution"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Pupil Caution</FormLabel>
                    <FormMessage /> 
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter notes" {...field} />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPupil;
