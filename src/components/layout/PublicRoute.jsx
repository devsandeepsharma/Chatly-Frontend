import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
    
    const { authenticate, initialized } = useSelector((state) => state.auth);

    if (!initialized) {
        return <h1>Loading..</h1>; 
    }

    return authenticate ? <Navigate to="/chats" replace /> : children;
}

export default PublicRoute;