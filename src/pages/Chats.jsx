import { useSelector } from "react-redux";

import Header from "../components/layout/Header";

const Chats = () => {

    const { user } = useSelector(state => state.auth);

    return (
        <>
            <Header />
            <div className="w-sm mx-auto mt-5 border border-gray-200">
                <img width={200} height={200} src={user?.avatar} />
                <h1>Hello {user?.username} 👋</h1>
            </div>
        </>
    )
}

export default Chats;