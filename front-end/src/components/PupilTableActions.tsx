import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useDeletePupil } from "@/api/Mutations";


interface Props {
  row: any; // replace with Row<Pupil> if using TypeScript generics
}

const PupilTableActions: React.FC<Props> = ({ row }) => {
  const deletePupilMutation = useDeletePupil();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  return (
    <>
      {/* Dropdown Menu Delete Item */}
      <DropdownMenuItem
        onClick={() => {
          setSelectedRowId(row.original._id);
          setDrawerOpen(true);
        }}
        className="text-destructive"
      >
        Delete
      </DropdownMenuItem>

      {/* Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-w-md w-full h-full p-6">
          <DrawerHeader>
            <DrawerTitle>Confirm Deletion</DrawerTitle>
            <DrawerDescription>
              Are you sure you want to delete <b>{row.original.forename}</b>? This action cannot be undone.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedRowId) {
                  deletePupilMutation.mutate(selectedRowId, {
                    onSuccess: () => setDrawerOpen(false),
                  });
                }
              }}
            >
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PupilTableActions;
