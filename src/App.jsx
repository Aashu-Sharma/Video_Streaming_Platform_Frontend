import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, fetchUserLikedVideos } from "./store/authSlice.js";
import { fetchUserPlaylists } from "./store/playlistSlice.js";
import { fetchUserWatchHistory } from "./store/watchHistorySlice.js";
import { fetchAllVideos } from "./store/videoSlice.js";
import {fetchProfileData} from './store/profileSlice.js';

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllVideos());
      dispatch(fetchUserPlaylists());
      dispatch(fetchUserLikedVideos());
      dispatch(fetchUserWatchHistory());
      dispatch(
        fetchProfileData({ profileType: "user", username: userData.username })
      );
      // dispatch(fetchProfileVideos({ profileType: "user" }));
      // dispatch(fetchProfilePosts({ profileType: "user" }));
    }
  }, [userId]);

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <div className="p-0 m-0 bg-black max-w-screen w-full min-h-screen flex">
          <AppSidebar />
          <SidebarInset
            className={`sidebar bg-transparent w-full h-full m-0 p-0`}
          >
            <Header userData={userData} />
            {<Outlet />}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}

export default App;
