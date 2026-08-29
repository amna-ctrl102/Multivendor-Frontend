import {createReducer} from "@reduxjs/toolkit";

const initialState={
    isLoading:true,
}

export const orderReducer= createReducer(initialState, (builder)=>{
    builder
        // get all orders of an user
        .addCase("getAllOrdersUserRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllOrdersUserSuccess", (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        })
        .addCase("getAllOrdersUserFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // get all products of a specific shop
        .addCase("getAllOrdersShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllOrdersShopSuccess", (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        })
        .addCase("getAllOrdersShopFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase("clearError", (state) => {
            state.error = null;
        });
})