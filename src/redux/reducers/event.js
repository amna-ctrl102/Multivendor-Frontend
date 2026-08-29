import {createReducer} from "@reduxjs/toolkit";

const initialState={
    isLoading:true,
}

export const eventReducer= createReducer(initialState, (builder)=>{
    builder
        .addCase("eventCreateRequest", (state)=>{
        state.isLoading = true;
        })
        .addCase("eventCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.event = action.payload;
            state.success = true;
        })
        .addCase("eventCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // get all events of a specfic shop
        .addCase("getAllEventShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllEventShopSuccess", (state, action) => {
            state.isLoading = false;
            state.events = action.payload;
        })
        .addCase("getAllEventShopFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // delete the event
        .addCase("deleteEventRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("deleteEventSuccess", (state,action) => {
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase("deleteEventFail", (state,action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // get events of all shops
        .addCase("getAllEventsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllEventsSuccess", (state, action) => {
            state.isLoading = false;
            state.allEvents = action.payload;
        })
        .addCase("getAllEventsFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase("clearError", (state) => {
            state.error = null;
        });
})