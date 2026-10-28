import type {ReactNode} from "react";
import {AdminSidebar} from "@/components/admin-sidebar";
import {AdminAccess} from "@/components/admin-access";
import {ContentProvider} from "@/components/content-provider";
export const metadata={title:"Organisation",robots:{index:false,follow:false}};
export default function AdminLayout({children}:{children:ReactNode}){return <AdminAccess><ContentProvider admin><div className="control-layout"><AdminSidebar/>{children}</div></ContentProvider></AdminAccess>;}
