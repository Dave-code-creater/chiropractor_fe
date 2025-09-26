import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: { byId: {}, allIds: [] },
  comments: { byId: {}, allIds: [] },
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {},
});

export const {} = entitiesSlice.actions;

export default entitiesSlice.reducer;
