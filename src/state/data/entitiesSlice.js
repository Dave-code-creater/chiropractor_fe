import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: { byId: {}, allIds: [] },
  posts: { byId: {}, allIds: [] },
  comments: { byId: {}, allIds: [] },
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {},
});

export default entitiesSlice.reducer;
