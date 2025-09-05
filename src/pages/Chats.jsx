import { useSelector } from "react-redux";

import Header from "../components/layout/Header";
import ProfileModal from "../components/profile/ProfileModal";
import SearchModal from "../components/chats/SearchModal";

const Chats = () => {

    const { user } = useSelector(state => state.auth);
    const { modalType } = useSelector(state => state.ui);

    return (
        <>
            { modalType === "profile" && <ProfileModal user={user} self /> }
            { modalType === "search" && <SearchModal /> }
            <Header />
            <div className="w-sm mx-auto mt-5 border border-gray-200">
                <img width={200} height={200} src={user?.avatar} />
                <h1>Hello {user?.username} 👋</h1>
            </div>
        </>
    )
}

export default Chats;