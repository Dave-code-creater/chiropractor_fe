import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  global: false,
  login: false,
  fetchPosts: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setGlobal(state, action) {
      state.global = action.payload;
    },
    setLogin(state, action) {
      state.login = action.payload;
    },
    setFetchPosts(state, action) {
      state.fetchPosts = action.payload;
    },
  },
});

export const { setGlobal, setLogin, setFetchPosts } = loadingSlice.actions;
export default loadingSlice.reducer;
