import { useSelector } from "react-redux";

const Chats = () => {

    const { user } = useSelector(state => state.auth);

    return (
        <>
            <img width={200} height={200} src={user?.avatar} />
            <h1>Hello {user?.username} 👋</h1>
        </>
    )
}

export default Chats;