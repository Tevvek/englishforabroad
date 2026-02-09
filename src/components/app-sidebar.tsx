import * as React from "react"
import {
  CalendarCheck2,
  CalendarPlus,
  CreditCard,
  House,
  WalletCards,
} from "lucide-react"

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
      title: "Home",
      url: "/dashboard/home",
      icon: House,
    },
    {
      title: "Book a Class",
      url: "/dashboard/book",
      icon: CalendarPlus,
    },
    {
      title: "My Classes",
      url: "/dashboard/classes",
      icon: CalendarCheck2,
    },
    {
      title: "Payments & Plans",
      url: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Credits & Usage",
      url: "/dashboard/credits",
      icon: WalletCards,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  brand?: React.ReactNode
  currentPath: string
}

export function AppSidebar({ brand, currentPath, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard/home">
                {brand ?? <span className="text-base font-semibold">Dashboard</span>}
                {brand && <span className="sr-only">Dashboard home</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardLogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
