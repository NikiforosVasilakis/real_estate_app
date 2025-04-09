import React from "react";
import { usePathname } from "next/navigation";
import { SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar, Sidebar } from "./ui/sidebar";
import { Building, FileText, Heart, Home, Menu, Settings, X } from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";


const AppSidebar = ({userType}: AppSidebarProps) =>{
    const pathname = usePathname();
    const {toggleSidebar, open} = useSidebar();

    const navlinks =
        userType === "manager"
        ? [
            [{icon: Building, laber: "Properties", href:"/managers/properties"},
             {icon: FileText, laber: "Applications", href:"/managers/applications"},
             {icon: Settings, laber: "Settings", href:"/managers/settings"},
            ]
        ] : 
        [
            {icon: Heart, laber: "Favorites", href:"/tenants/favorites"},
            {icon: Home, laber: "Residences", href:"/tenants/residences"},
            {icon: Settings, laber: "Settings", href:"/tenants/settings"},
        ];
    
    return(
        <Sidebar collapsible="icon" className="fixed left-0 bg-white shadow-lg" style={{top: `${NAVBAR_HEIGHT}px`, height: `calc(100vh - ${NAVBAR_HEIGHT}px)`}}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className={cn(
                            "flex min-h-[56px] w-full items-center pt-3 mb-3", open ? "justify-between px-6" : "justify-center"
                        )}>
                            {open ? (
                                <>
                                    <h1 className="text-xl font-bold text-gray-800">
                                        {userType==="manager"? "manager View": "Renter view"}
                                    </h1>
                                    <button className="hover:bg-gray-100 p-2 rounded-md" onClick={()=>toggleSidebar()}>
                                        <X className="h-6 w-6 text-gray-600" />
                                    </button>
                                </>
                            ):
                            (
                                <button className="hover:bg-gray-100 p-2 rounded-md" onClick={()=>toggleSidebar()}>
                                    <Menu className="h-6 w-6 text-gray-600" />
                                </button>
                            )}
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
        </Sidebar>
    )
}

export default AppSidebar;