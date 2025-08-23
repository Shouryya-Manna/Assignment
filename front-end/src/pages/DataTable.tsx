"use client";

import { useMemo, useState } from "react";
import type { ColumnDef, Row, Column } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { useDeletePupil } from "@/api/Mutations";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const memoizedColumns = useMemo(() => columns || [], [columns]);
  const memoizedData = useMemo(() => data || [], [data]);
  const deletePupilMutation = useDeletePupil();

  if (!memoizedColumns.length) return <div>No columns defined.</div>;

  const filterableColumns = ["forename", "surname", "title", "licenseType"];
  const [filterColumn, setFilterColumn] = useState<string>(filterableColumns[0]);
  const [filterValue, setFilterValue] = useState<string>("");

  const [rowSelection, setRowSelection] = useState({});
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      globalFilter: filterValue,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row._id,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cell = row.getValue(columnId);
      if (cell === undefined || cell === null) return false;
      return String(cell).toLowerCase().includes(String(filterValue).toLowerCase());
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original._id);
  const selectedNames = selectedRows.map((row) => row.original.forename);

  const handleFilterColumnChange = (val: string) => {
    setFilterColumn(val);
    setFilterValue(""); // reset search when changing column
  };

  function getColumnLabel<TData, TValue>(column: Column<TData, TValue>) {
    const { columnDef } = column;
    if (typeof columnDef.header === "string") return columnDef.header;
    const meta = columnDef.meta as { label?: string } | undefined;
    if (meta?.label) return meta.label;

    const key =
      (columnDef as any).accessorKey ?? (typeof column.id === "string" ? column.id : "");
    const text = String(key);
    if (!text) return column.id;

    return text
      .split(".")
      .map((part) =>
        part
          .replace(/_/g, " ")
          .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
          .replace(/^\w/, (c) => c.toUpperCase())
      )
      .join(" ");
  }

  function getLabelById<TData>(table: any, id: string) {
    const col =
      table.getAllLeafColumns().find((c: Column<TData, any>) => c.id === id) ??
      table.getAllColumns().find((c: Column<TData, any>) => c.id === id);
    return col ? getColumnLabel(col) : id;
  }

  return (
    <div className="space-y-6 ">
      {/* Filters + Bulk Delete */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filterColumn} onValueChange={handleFilterColumnChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {filterableColumns.map((colId) => (
              <SelectItem key={colId} value={colId}>
                {getLabelById(table, colId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder={`Filter by ${getLabelById(table, filterColumn)}...`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />

        <Button
          variant="destructive"
          disabled={selectedIds.length === 0}
          onClick={() => setBulkDialogOpen(true)}
        >
          Delete Selected ({selectedIds.length})
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {getColumnLabel(column)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-6 z-50 rounded-lg bg-white shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <b>{selectedIds.length}</b> pupil
                {selectedIds.length > 1 && "s"}?
                <br />
                {selectedIds.length <= 5 && (
                  <span>({selectedNames.join(", ")})</span>
                )}
                <br />This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setBulkDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedIds.length > 0) {
                    deletePupilMutation.mutate(selectedIds, {
                      onSuccess: () => setBulkDialogOpen(false),
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

      {/* Table */}
      <div className="rounded-xl border shadow-sm overflow-hidden">
        <div className="max-h-[600px] overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="odd:bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={memoizedColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={`${table.getState().pagination.pageSize}`}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 25, 30].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
