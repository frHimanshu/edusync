import type React from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function HODLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccessControl allowedRoles={["hod"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType="hod" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
        </div>
      </div>
    </AccessControl>
  )
}
