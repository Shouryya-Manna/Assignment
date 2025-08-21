import { useDeletePupil } from "@/api/Mutations";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelectedPupil } from "@/context/SelectedRowContext";
import type { Pupil } from "@/schemas/schema";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<Pupil>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.getValue("title") || "-",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "forename",
    header: "Forename",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "surname",
    header: "Surname",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const dob = row.getValue("dob") as string;
      return dob ? new Date(dob).toLocaleDateString("en-GB") : "-";
    },
    sortingFn: "datetime", // sort DOB properly
    filterFn: "includesString", // filter DOB as string (or custom date filter)
  },
  {
    accessorKey: "gender",
    header: "Gender",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "home.mobile",
    header: "Mobile",
    cell: ({ row }) => row.original.home?.mobile || "-",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "pickupAddress.postcode",
    header: "Pickup Postcode",
    cell: ({ row }) => row.original.pickupAddress?.postcode || "-",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "pickupAddress.houseNo",
    header: "Pickup House No",
    cell: ({ row }) => row.original.pickupAddress?.houseNo || "-",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "pickupAddress.address",
    header: "Pickup Address",
    cell: ({ row }) => row.original.pickupAddress?.address || "-",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "licenseType",
    header: "LicenseType",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: { row: Row<Pupil> }) => {
      const [dialogOpen, setDialogOpen] = useState(false);
      const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
      const navigate = useNavigate();
      const deletePupilMutation = useDeletePupil();

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
               <DropdownMenuItem
                onClick={() => {
                  // SIMPLIFIED: Just navigate. The detail page will handle the fetching.
                  navigate(`/pupils/${row.original._id}`);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // You might still use context for an Edit form to pre-fill data
                  // setSelectedPupil(row.original); 
                  navigate(`/pupils/edit/${row.original._id}`); // Example edit route
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelectedRowId(row.original._id);
                  setDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog for delete confirmation */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogPortal>
              {/* Overlay with blur */}
              <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

              <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-6 z-50 rounded-lg bg-white shadow-lg">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete{" "}
                    <b>{row.original.forename}</b>? This action cannot be
                    undone.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (selectedRowId) {
                        deletePupilMutation.mutate(selectedRowId, {
                          onSuccess: () => setDialogOpen(false),
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </>
      );
    },
  },
];
