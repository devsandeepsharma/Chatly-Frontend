import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    suggestedUsers: [],
    selectedChat: null,
    messages: [],
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
        removeChat(state, action) {
            state.chats = state.chats.filter(c => c._id !== action.payload);
            if (state.selectedChat && state.selectedChat._id === action.payload) {
                state.selectedChat = null;
            }
            state.messages = [];
        },
        updateChat(state, action) {
            const updatedChat = action.payload;
            state.chats = state.chats.map(c =>
                c._id === updatedChat._id ? updatedChat : c
            );
            if (state.selectedChat && state.selectedChat._id === updatedChat._id) {
                state.selectedChat = updatedChat;
            }
        },
        setSuggestedUsers(state, action) {
            state.suggestedUsers = action.payload;
        },
        setSelectedChat(state, action) {
            state.selectedChat = action.payload;
        },
        setMessages(state, action) {
            state.messages = action.payload;
        },
        addMessage(state, action) {
            state.messages.push(action.payload);
        },
        addUserToChat(state, action) {
            const chat = state.chats.find(c => c._id === action.payload.chatId);
            if (chat) {
                chat.users.push(action.payload.user);
            }
            if (state.selectedChat && state.selectedChat._id === action.payload.chatId) {
                state.selectedChat.users.push(action.payload.user);
            }
        },
        removeUserFromChat(state, action) {
            const chat = state.chats.find(c => c._id === action.payload.chatId);
            if (chat) {
                chat.users = chat.users.filter(u => u._id !== action.payload.userId);
            }
            if (state.selectedChat && state.selectedChat._id === action.payload.chatId) {
                state.selectedChat.users = state.selectedChat.users.filter(u => u._id !== action.payload.userId);
            }
        }
    }
});

export const chatsActions = chatsSlice.actions;
export default chatsSlice.reducer;