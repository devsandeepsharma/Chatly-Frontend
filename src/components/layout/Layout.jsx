import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3]" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-[#FF6B6B] to-[#FFD93D]" />
            </div>
            <Outlet />
        </> 
    )
}

export default Layout;