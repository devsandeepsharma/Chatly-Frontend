import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { authActions } from "../../store/authSlice";

const Layout = () => {

    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUser = async () => {

            if (!token || user) return;

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                dispatch(authActions.login(res.data.data.user));
            } catch (err) {
                console.error("Auth check failed", err);
                localStorage.removeItem("token");
                dispatch(authActions.logout());
            }
        };
        fetchUser();
    }, [token, user, dispatch]);

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