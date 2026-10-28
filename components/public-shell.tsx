import {ContentProvider} from "./content-provider";
import {SiteHeader,Footer} from "./site-header";
import type {ReactNode} from "react";
import {RingIntro} from "./ring-intro";
export function PublicShell({children}:{children:ReactNode}){return <><RingIntro/><div className="cinema premium"><ContentProvider><a href="#main" className="cinema-skip">Zum Inhalt</a><SiteHeader/><main id="main">{children}</main><Footer/></ContentProvider></div></>;}
