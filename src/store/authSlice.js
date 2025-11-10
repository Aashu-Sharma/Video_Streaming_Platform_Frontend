import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (rejectWithValue) => {
    try {
      const response = await axios.get("/api/v1/users/current-user");
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const fetchUserLikedVideos = createAsyncThunk(
  "auth/fetchUserLikedVideos",
  async (rejectWithValue) => {
    try {
      console.log("Fetching User LikedVideos....");
      const response = await axios.get("/api/v1/likes/videos");
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

const initialState = {
  status: false,
  userData: null,
  userVideos: null,
  userPlaylists: null,
  userPosts: null,
  errors: null,
  likedVideos: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
      state.status = true;
    },

    logOut: (state) => {
      state.userData = null;
      state.status = false;
    },

    setUserProfileData: (state, action) => {
      state.userData = action.payload;
      state.status = true;
    },

    setUserVideos: (state, action) => {
      state.userVideos = action.payload;
    },

    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.userData = null;
      });

    builder
      .addCase(fetchUserLikedVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserLikedVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.likedVideos = action.payload;
      })
      .addCase(fetchUserLikedVideos.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.error.message;
      });
  },
});

export const {
  login,
  logOut,
  setUserProfileData,
  setUserPlaylists,
  setUserVideos,
  setUserPosts,
} = authSlice.actions;

export default authSlice.reducer;
