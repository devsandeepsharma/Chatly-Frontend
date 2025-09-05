import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modalType: null,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openModal (state, action) {
            state.modalType = action.payload.type;
        },
        closeModal (state) {
            state.modalType = null;
        }
    }
})

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;