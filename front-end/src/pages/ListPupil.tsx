import { useShowAllPupilsQuery } from "@/api/Queries"
import DataTable from "./DataTable"
import { columns } from "./Column"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2, Users } from "lucide-react"

function ListPupil() {
  const { pupils, isLoading, isError } = useShowAllPupilsQuery()

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto">
      <Card className="shadow-xl border-0 rounded-3xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="px-8 py-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-serif font-bold text-slate-800">Pupils Directory</CardTitle>
              <CardDescription className="text-lg text-slate-600 font-sans">
                Comprehensive management of all registered pupils
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="p-4 bg-indigo-50 rounded-full">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
              <span className="text-lg font-sans text-slate-600">Loading pupils data...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="p-4 bg-red-50 rounded-full">
                <Users className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-semibold text-red-600 mb-2">Unable to Load Data</h3>
                <p className="text-slate-600 font-sans">Failed to fetch pupil information. Please try again later.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-semibold text-slate-800">All Pupils</h3>
                  <p className="text-sm font-sans text-slate-600">{pupils?.data?.length || 0} pupils registered</p>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-6">
                <DataTable columns={columns} data={pupils?.data ?? []} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ListPupil
