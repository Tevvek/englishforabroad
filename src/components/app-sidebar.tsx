import * as React from "react"
import {
  IconBook,
  IconCalendar,
  IconDashboard,
  IconInnerShadowTop,
  IconLibrary,
  IconNotebook,
  IconSettings,
  IconTarget,
  IconTrendingUp,
  IconVideo,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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
  user: {
    name: "Student",
    email: "student@example.com",
    avatar: "/avatars/student.jpg",
  },
  navMain: [
    {
      title: "(TODO) Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "(TODO) My Classes",
      url: "#",
      icon: IconVideo,
    },
    {
      title: "(TODO) Lessons",
      url: "#",
      icon: IconBook,
    },
    {
      title: "(TODO) Homework",
      url: "#",
      icon: IconNotebook,
    },
    {
      title: "(TODO) Progress",
      url: "#",
      icon: IconTrendingUp,
    },
    {
      title: "(TODO) Practice",
      url: "#",
      icon: IconTarget,
    },
    {
      title: "(TODO) Resources",
      url: "#",
      icon: IconLibrary,
    },
    {
      title: "(TODO) Calendar",
      url: "#",
      icon: IconCalendar,
    },
  ],
  navSecondary: [
    {
      title: "(TODO) Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">English for Abroad</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
