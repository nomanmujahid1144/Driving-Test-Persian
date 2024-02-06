import { Outlet } from "react-router"
import { Navbar } from "./Navbar"
import SideBar from "./SideBar"

export const SideAndNavbar = () => {
    return (
        <>
            <SideBar />
            <Outlet />
            <Navbar />
        </>
    )
}