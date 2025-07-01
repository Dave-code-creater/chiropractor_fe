import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: { byId: {}, allIds: [] },
  comments: { byId: {}, allIds: [] },
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {
    // Add any post or comment related reducers here
  },
});

export const {} = entitiesSlice.actions;

export default entitiesSlice.reducer;
