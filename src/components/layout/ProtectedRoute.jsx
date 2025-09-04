import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {

    const { authenticate, initialized } = useSelector((state) => state.auth);

    if (!initialized) {
        return <h1>Loading...</h1>; 
    }

    return authenticate ? children : <Navigate to="/" replace />
}

export default ProtectedRoute;