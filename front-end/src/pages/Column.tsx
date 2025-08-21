import type { Pupil } from "@/schemas/schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Pupil>[] = [
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
];
