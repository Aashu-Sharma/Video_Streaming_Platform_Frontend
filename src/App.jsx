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
import { setVideoData } from "./store/videoSlice";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import {
  fetchProfileData,
  fetchProfileVideos,
  fetchProfilePosts,
} from "./store/profileSlice.js";

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;

  const getAllVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/videos`);
      if (response.status === 200) {
        dispatch(setVideoData(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching videos: ", error);
    }
  };

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  useEffect(() => {
    if (userId) {
      getAllVideos();
      dispatch(fetchUserPlaylists());
      dispatch(fetchUserLikedVideos());
      dispatch(fetchUserWatchHistory());
      dispatch(
        fetchProfileData({ profileType: "user", username: userData.username })
      );
      dispatch(fetchProfileVideos({ profileType: "user" }));
      dispatch(fetchProfilePosts({ profileType: "user" }));
    }
  }, [userId]);
  
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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
