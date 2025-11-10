import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserPlaylists = createAsyncThunk(
  "playlists/fetchUserPlaylists",
  async (rejectWithValue) => {
    try {
      console.log("Fetching User Playlists....");
      const response = await axios.get("/api/v1/dashboard/playlists");
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlists/createPlaylists",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Creating Playlist....");
      const response = await axios.post(`/api/v1/playlist`, data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlists/updatePlaylist",
  async ({ data, playlistId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/v1/playlist/${playlistId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlists/deletePlaylist",
  async (playlistId, { rejectWithValue }) => {
    try {
      console.log("Deleting playlist....");
      const response = await axios.delete(`/api/v1/playlist/${playlistId}`);
      const data = response.data.data;
      return { data, playlistId };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlists/removeVideoFromPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      console.log("Removing video.....");
      const response = await axios.patch(
        `/api/v1/playlist/remove/${videoId}/${playlistId}`
      );
      const data = response.data.data;
      return { data, videoId, playlistId };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

const playlistSlice = createSlice({
  name: "playlists",
  initialState: {
    userPlaylists: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userPlaylists = action.payload;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createPlaylist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userPlaylists = [action.payload, ...state.userPlaylists];
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updatePlaylist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userPlaylists = state.userPlaylists.map((playlist) => {
          if (playlist._id === action.payload._id) {
            return {
              ...playlist,
              name: action.payload.name,
              description: action.payload.description,
            };
          }
          return playlist;
        });
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deletePlaylist.pending, (state, action) => {
        state.status = "deleting...";
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userPlaylists = state.userPlaylists.filter(
          (playlist) => playlist._id !== action.payload.playlistId
        );
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(removeVideoFromPlaylist.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userPlaylists = state.userPlaylists.map((playlist) => {
          if (playlist._id === action.payload.playlistId) {
            return {
              ...playlist,
              videos: playlist.videos.filter(
                (video) => video._id !== action.payload.videoId
              ),
            };
          }
          return playlist;
        });
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default playlistSlice.reducer;
