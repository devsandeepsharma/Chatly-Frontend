import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/layout/Layout";
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
                    element: <Landing />                    
                },
                {
                    path: "/auth",
                    element: <Auth />                    
                },
                {
                    path: "/chats",
                    element: <Chats />                    
                }
            ]
        }
    ])

    return <RouterProvider router={router} />
}

export default App;