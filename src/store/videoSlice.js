import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllVideos = createAsyncThunk(
  "videos/fetchAllVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/videos`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  "videos/fetchVideoById", 
  async (videoId, {rejectWithValue}) => {
    try {
      const response = await axios.get(`/api/v1/videos/${videoId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
)

export const createVideo = createAsyncThunk(
  "videos/createVideo",
  async (videoData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/v1/videos/createVideo`,
        videoData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const updateVideo = createAsyncThunk(
  "videos/updateVideo",
  async ({ videoId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/v1/videos/${videoId}`,
        updatedData
      );
      console.log("Update Video Response:", response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/v1/videos/${videoId}`)
        return videoId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

const initialState = {
  videos: [],
  status: null,
  error: null,
  video: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videos = action.payload.data;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.video = action.payload.data;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createVideo.fulfilled, (state, action) => {
        state.videos = [...state.videos, action.payload.data];
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.error = action.payload.message;
      })

      .addCase(updateVideo.fulfilled, (state, action) => {
        state.videos = state.videos.map((video) => {
          video._id === action.payload.data._id ? action.payload.data : video
        });
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.error = action.payload.message;
      })

      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((video) => video._id !== action.payload );
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.error = action.payload.message;
      });
  },
});

export default videoSlice.reducer;
