import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicRoute from "./components/layout/PublicRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Chats from "./pages/Chats";

const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: (
                        <PublicRoute>
                            <Landing />  
                        </PublicRoute>
                    )                  
                },
                {
                    path: "/auth",
                    element: <Auth />                    
                },
                {
                    path: "/chats",
                    element: (
                        <ProtectedRoute>
                            <Chats />   
                        </ProtectedRoute>
                    )                 
                }
            ]
        }
    ])

    return <RouterProvider router={router} />
}

export default App;