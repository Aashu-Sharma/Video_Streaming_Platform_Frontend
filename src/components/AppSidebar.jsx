import { Home, X, Library, Laptop } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
  useSidebar,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
    link: "/",
  },
  {
    title: "Subscriptions",
    url: "#",
    icon: Laptop,
    link: "/",
  },
  {
    title: "Library",
    url: "#",
    icon: Library,
    link: "/",
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className={`h-screen bg-black border-r text-black`}
    >
      <SidebarContent className="bg-black text-black  relative  ">
        <SidebarGroup>
          <SidebarGroupLabel className="bg-black text-white">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu className={"text-white"}>
            {items.map((item) => (
              <Link to={item.link} className="w-full h-full">
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className={" rounded-lg hover:text-gray-700"}>
                    <item.icon className="w-[30px] h-[30px]" />
                    <p className="text-sm text-white">{item.title}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className={"absolute top-0 right-0"}>
          <SidebarGroupAction onClick={toggleSidebar}>
            <X className="w-[20px] h-[20px] text-white " />
          </SidebarGroupAction>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
