import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfileData = createAsyncThunk(
  "profile/fetchProfileData",
  async ({ profileType, username }, { rejectWithValue }) => {
    try {
      console.log(`ProfileType: ${profileType}`);
      const response = await axios.get(`/api/v1/users/c/${username}`);
      console.log(`ProfileData: ${response.data.data}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const fetchProfileVideos = createAsyncThunk(
  "profile/fetchProfileVideos",
  async ({ profileType, userId }, { rejectWithValue }) => {
    try {
      console.log(`ProfileType: ${profileType}`);
      let url =
        profileType !== "user"
          ? `/api/v1/videos?userId=${userId}`
          : "/api/v1/dashboard/videos";

      const response = await axios.get(url);
      console.log(`Profile Videos: ${response.data.data}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const fetchProfilePosts = createAsyncThunk(
  "profile/fetchProfilePosts",
  async ({ profileType, userId }, { rejectWithValue }) => {
    try {
      console.log(`ProfileType: ${profileType}`);
      let url =
        profileType !== "user"
          ? `/api/v1/tweets/user/${userId}`
          : `/api/v1/dashboard/posts`;

      const response = await axios.get(url);
      console.log(`ProfilePosts: ${response.data.data}`);
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
  profileData: null,
  profileVids: null,
  profilePosts: null,
  errors: null,
  status: "idle",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearAllPreviousData: (state) => {
      state.profileData = null;
      state.profileVids = null;
      state.profilePosts = null;
      state.errors = null;
      state.status = "idle"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.status = "loading...";
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profileData = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.status = "failed"
        state.errors = action.payload;
      })

      .addCase(fetchProfileVideos.pending, (state) => {
        state.status = "loading...";
      })
      .addCase(fetchProfileVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profileVids = action.payload;
      })
      .addCase(fetchProfileVideos.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })

      .addCase(fetchProfilePosts.pending, (state) => {
        state.status = "loading...";
      })
      .addCase(fetchProfilePosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profilePosts = action.payload;
      })
      .addCase(fetchProfilePosts.rejected, (state, action) => {
        state.status = "failed"
        state.errors = action.payload;
      });
  },
});

export const { clearAllPreviousData } = profileSlice.actions;
export default profileSlice.reducer;
