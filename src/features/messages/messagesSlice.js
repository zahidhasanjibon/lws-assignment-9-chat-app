import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isScroll:false
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        scrolling : (state,action) => {
            state.isScroll= true
        },
        scrollingF : (state,action) => {
            state.isScroll= false
        }

    },
});

export const {scrolling,scrollingF} = messagesSlice.actions;
export default messagesSlice.reducer;
