import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserWatchHistory = createAsyncThunk(
  "watchHistory/fetchUserWatchHistory",
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(`/api/v1/users/watchHistory`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const removeVideoFromWatchHistory = createAsyncThunk(
  "watchHistory/removeVideoFromWatchHistory",
  async (videoId, { rejectWithValue }) => {
    try {
      await axios.patch(
        `/api/v1/users/watchHistory/${videoId}`
      );
      return videoId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

const watchHistorySlice = createSlice({
  name: "watchHistory",
  initialState: {
    history: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearWatchHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWatchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserWatchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchUserWatchHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeVideoFromWatchHistory.pending, (state, action) => {
        state.status = "removing...";
      })
      .addCase(removeVideoFromWatchHistory.fulfilled, (state, action) => {
        state.status = "successfully removed";
        state.history = state.history.filter(
          (video) => video._id !== action.payload
        );
      })
      .addCase(removeVideoFromWatchHistory.rejected, (state, action) => {
        state.status = "failed to remove";
        state.error = action.error.message;
      });
  },
});

export const { clearWatchHistory } = watchHistorySlice.actions;
export default watchHistorySlice.reducer;
