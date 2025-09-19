"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { HostelOccupancyMap } from "@/components/hostel-occupancy-map"
import { AccessControl } from "@/components/auth/access-control"

export default function HostelOccupancyMapPage() {
  const router = useRouter()

  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push("/authority/hostel/dashboard")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Hostel Occupancy Map</h1>
                  <p className="text-gray-600">Visual overview of all room occupancy status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Occupancy Map */}
          <HostelOccupancyMap />
        </div>
      </div>
    </AccessControl>
  )
}
