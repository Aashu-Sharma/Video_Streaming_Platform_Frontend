import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice.js';
import videoSlice from './videoSlice.js';
// import playlistSlice from './playlistSlice.js';

const store = configureStore({
    reducer: {
        auth: authSlice,
        videos: videoSlice,
        // playlists: playlistSlice,
    }
});

export default store;