import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser", 
    async () => {
        const response = await axios.get("/api/v1/users/current-user")
        // console.log("Current User Data: ", response.data.data);
        return response.data.data;
    }
)


const initialState = {
    status: false,
    userData: null,
    userVideos: null,
    userPlaylists: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login : (state, action) => {
            state.userData = action.payload;
            state.status = true;
        },

        logOut : (state) => {
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
        setUserPlaylists: (state, action) => {
            state.userPlaylists = action.payload;
        }
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

    }
})

export const {login, logOut, setUserProfileData, setUserPlaylists, setUserVideos} = authSlice.actions;

export default authSlice.reducer;