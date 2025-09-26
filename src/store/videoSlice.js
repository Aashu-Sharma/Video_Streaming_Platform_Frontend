import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    videos: [],
    status: null,
}

const videoSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        setVideoData: (state, action) => {
            state.videos = action.payload;
            state.status = "success"
        }
    }
})

export const {setVideoData} = videoSlice.actions;
export default videoSlice.reducer;