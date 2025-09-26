// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// export const getPlaylists = createAsyncThunk(
//   "playlists/getPlaylists",
//   async () => {
//     const response = await axios.get("/api/v1/dashboard/playlists");
//     console.log(response.data.data);
//     const playlists = response.data.data;
//     const message = response.data.message;
//     console.log(message)
//     return {playlists, message}
//   }
// );

// const initialState = {
//   playlists: [],
//   status: null,
//   error: null,
//   successMessage: null,
// };

// const playlistSlice = createSlice({
//   name: "playlists",
//   initialState,
//   reducers: {
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(getPlaylists.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getPlaylists.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.playlists = action.payload.playlists;
//         state.successMessage = action.payload.message;
//       })
//       .addCase(getPlaylists.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// // export const { setPlaylists } = playlistSlice.actions;
// export default playlistSlice.reducer;
