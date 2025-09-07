import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    suggestedUsers: [],
    selectedChat: null,
};

const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        setChats(state, action) {
            state.chats = action.payload;
        },
        addChat(state, action) {
            const exists = state.chats.find(c => c._id === action.payload._id);
            if (!exists) {
                state.chats.unshift(action.payload);
            }
        },
        setSuggestedUsers(state, action) {
            state.suggestedUsers = action.payload;
        },
        setSelectedChat(state, action) {
            state.selectedChat = action.payload;
        }
    }
});

export const chatsActions = chatsSlice.actions;
export default chatsSlice.reducer;