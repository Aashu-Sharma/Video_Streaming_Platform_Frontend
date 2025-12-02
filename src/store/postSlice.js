import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfilePosts = createAsyncThunk(
  "posts/fetchProfilePosts",
  async ({ profileType, userId }, { rejectWithValue }) => {
    try {
      let url =
        profileType !== "user"
          ? `/api/v1/tweets/user/${userId}`
          : `/api/v1/dashboard/posts`;

      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/v1/tweets/create`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({tweetId, updatedData}, {rejectWithValue}) => {
    console.log("tweetId: ", tweetId, "data: ", updatedData)
    try {
      const response = await axios.patch(`/api/v1/tweets/${tweetId}`, updatedData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      } );
      console.log("Updated post: ", response.data.data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
)

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (tweetId, {rejectWithValue}) => {
    try {
      await axios.delete(`/api/v1/tweets/${tweetId}`);
      return tweetId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
)

const initialState = {
  posts: null,
  errors: null,
  status: "idle",
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setUserPosts: (state, action) => {
      state.profilePosts = action.payload;
    },
    clearPosts: (state) => {
      state.posts = null;
      state.status = "idle";
      state.errors = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfilePosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfilePosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchProfilePosts.rejected, (state, action) => {
        state.state = "failed";
        state.errors = action.payload;
      })


      .addCase(createPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })

      .addCase(updatePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.map((post) => {
          if(post._id === action.payload._id){
            return {
              ...post,
              content: action.payload.content,
              images: action.payload.images
            }
          }
          return post
      });
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })

       .addCase(deletePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })
  },
});

export const { setUserPosts, clearPosts } = postSlice.actions;
export default postSlice.reducer;
