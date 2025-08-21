import React from "react";
import { useShowAllPupilsQuery } from "@/api/Queries";
import DataTable from "./DataTable";
import { columns } from "./Column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function ListPupil() {
  const { pupils, isLoading, isError } = useShowAllPupilsQuery();

  return (
    <div className="p-6 max-w-fit mx-auto">
      <Card className="shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl font-semibold">Pupils List</CardTitle>
              <CardDescription>
                Manage and view all registered pupils
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading pupils...</span>
            </div>
          ) : isError ? (
            <div className="text-center text-red-600 font-medium py-10">
              ❌ Failed to fetch pupil data
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={pupils?.data ?? []}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ListPupil;
