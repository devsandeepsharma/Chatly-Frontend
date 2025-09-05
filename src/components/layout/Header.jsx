import { useDispatch, useSelector } from "react-redux";

import Logo from "../ui/Logo";
import { uiActions } from "../../store/uiSlice";
import { Search } from "lucide-react";

const Header = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);

    const openProfileModel = () => {
        dispatch(uiActions.openModal({ type: "profile" }));
    }

    const openSearchModel = () => {
        dispatch(uiActions.openModal({ type: "search" }));
    }

    return (
        <header className="sticky top-0 z-40 h-16 bg-white/70 border-b border-gray-200/80">
            <div className="p-4 w-full max-w-7xl mx-auto flex items-center justify-between">
                <Logo />
                <nav className="flex justify-center items-center gap-4" aria-label="primary navigation">
                    <button 
                        onClick={openSearchModel}
                        className="inline-flex items-center justify-center gap-2 text-sm text-gray-700 px-4 py-2 hover:text-[#00BFA6] transition-colors cursor-pointer"
                    >
                        <Search className="h-4 w-4" /> Search
                    </button>
                    <button
                        className="w-8 h-8 rounded-full overflow-hidden border-1 border-[#00BFA6]/50 shadow-sm hover:shadow-md transition cursor-pointer"
                        aria-label="Profile"
                        onClick={openProfileModel}
                    >
                        {
                            user?.avatar ? (
                                <img
                                    src={user?.avatar}
                                    alt={user?.username || "User Avatar"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                                    {user?.username?.[0]?.toUpperCase() || "U"}
                                </div>
                            )
                        }
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header;