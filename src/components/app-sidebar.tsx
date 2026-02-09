import * as React from "react"

import { DashboardLogoutButton } from "@/components/dashboard-logout-button"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  brand?: React.ReactNode
}

export function AppSidebar({ brand, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                {brand ?? <span className="text-base font-semibold">Dashboard</span>}
                {brand && <span className="sr-only">Dashboard home</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardLogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
