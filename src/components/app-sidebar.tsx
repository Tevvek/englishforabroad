import * as React from "react";

import { IconCalendar, IconHome, IconReceipt } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SignOutButton from "./auth/sign-out-button";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: IconHome,
    },
    {
      title: "Booking",
      url: "/dashboard/booking",
      icon: IconCalendar,
    },
    {
      title: "Purchase credits",
      url: "/dashboard/purchase",
      icon: IconReceipt,
    },
  ],
};

export function AppSidebar({
  children,
  selectedNavItem,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  selectedNavItem?: string;
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {children}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} selectedNavItem={selectedNavItem} />
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
