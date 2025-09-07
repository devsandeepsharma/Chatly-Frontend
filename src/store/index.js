import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import uiSlice from "./uiSlice";
import chatsSlice from "./chatsSlice";

const store = configureStore({
    reducer: {
        "auth": authSlice,
        "ui": uiSlice,
        "chats": chatsSlice,
    }
})

export default store;