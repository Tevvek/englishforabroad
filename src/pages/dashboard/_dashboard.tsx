import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { ReactNode } from "react"

interface DashboardShellProps {
  brand?: ReactNode
  children: ReactNode
}

export default function DashboardShell({ brand, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" brand={brand} />
      <SidebarInset>
        <SiteHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
