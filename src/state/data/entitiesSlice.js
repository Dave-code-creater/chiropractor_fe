import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: { email: {}, allIds: [] },
  posts: { byId: {}, allIds: [] },
  comments: { byId: {}, allIds: [] },
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {},
});

export default entitiesSlice.reducer;
