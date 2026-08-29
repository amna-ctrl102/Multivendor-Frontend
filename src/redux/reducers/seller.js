import {createReducer} from "@reduxjs/toolkit";

const initialState={
    isSeller: false,
    isLoading: true,
    seller: null,
    error: null,
};

export const sellerReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadSellerRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("LoadSellerSuccess", (state, action) => {
            state.isSeller = true;
            state.isLoading = false;
            state.seller = action.payload;
        })
        .addCase("LoadSellerFail", (state, action) => {
            state.isSeller = false;
            state.isLoading = false;
            state.error = action.payload;
            state.seller = null;
        })
        .addCase("LogoutSuccess", (state) => {
            state.isSeller = false;
            state.isLoading = false;
            state.seller = null;
            state.error = null;
        })
        .addCase("clearError", (state) => {
            state.error = null;
        });
});