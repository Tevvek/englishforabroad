import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-4 lg:p-6">
          <h1 className="text-2xl font-semibold">Hello world</h1>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
