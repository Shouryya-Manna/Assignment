import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelectedPupil } from "@/context/SelectedRowContext";
import type { Pupil } from "@/schemas/schema";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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
    const navigate = useNavigate();
    const { setSelectedPupil } = useSelectedPupil();

    return (
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
              setSelectedPupil(row.original);
              console.log("Navigating to pupil:", row.original._id);
              navigate(`/pupils/${row.original._id}`);
            }}
          >
            View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
}
];
