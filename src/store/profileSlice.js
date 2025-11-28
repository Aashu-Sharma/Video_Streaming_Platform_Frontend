import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfileData = createAsyncThunk(
  "profile/fetchProfileData",
  async ({ profileType, username }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/users/c/${username}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

// export const fetchProfileVideos = createAsyncThunk(
//   "profile/fetchProfileVideos",
//   async ({ profileType, userId }, { rejectWithValue }) => {
//     try {
//       let url =
//         profileType !== "user"
//           ? `/api/v1/videos?userId=${userId}`
//           : "/api/v1/dashboard/videos";

//       const response = await axios.get(url);
//       return response.data.data;
//     } catch (error) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(error.response.data);
//       }
//       return rejectWithValue({ message: "Something went wrong" });
//     }
//   }
// );
 
export const updateUserCoverImage = createAsyncThunk(
  "profile/updateUserCoverImage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/users/coverImage`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "profile/updateUserAvatar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/users/avatar`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const updateUserAccountDetails = createAsyncThunk(
  "profile/updateUserAccountDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/users/update-user`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "profile/updateUserPassword",
  async(data, {rejectWithValue}) => {
    try {
      const response = await axios.patch(`/api/v1/users/change-password`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
)

const initialState = {
  profileData: null,
  errors: null,
  datastatus: "idle",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {

    clearAllPreviousData: (state) => {
      state.profileData = null;
      state.errors = null;
      state.datastatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.datastatus = "loading";
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.datastatus = "succeeded";
        state.profileData = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.datastatus = "failed";
        state.errors = action.payload;
      })


      .addCase(updateUserCoverImage.fulfilled, (state, action) => {
        state.profileData = {
          ...state.profileData,
          coverImage: action.payload.data.coverImage,
        };
      })
      .addCase(updateUserCoverImage.rejected, (state, action) => {
        state.errors = action.payload;
      })

      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.profileData = {
          ...state.profileData,
          avatar: action.payload.data.avatar,
        };
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.errors = action.payload;
      })

      .addCase(updateUserAccountDetails.fulfilled, (state, action) => {
        state.profileData = {
          ...state.profileData,
          username: action.payload.data.username,
          email: action.payload.data.email
        };
      })
      .addCase(updateUserAccountDetails.rejected, (state, action) => {
        state.errors = action.payload;
      })

      .addCase(updateUserPassword.rejected, (state, action) => {
        state.errors = action.payload;
      });
  },
});

export const { clearAllPreviousData } = profileSlice.actions;
export default profileSlice.reducer;
