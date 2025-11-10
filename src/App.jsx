import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  setUserProfileData,
  setUserVideos,
  setUserPosts,
  fetchUserLikedVideos,
} from "./store/authSlice.js";
import { fetchUserPlaylists } from "./store/playlistSlice.js";
import {fetchUserWatchHistory} from './store/watchHistorySlice.js'
import { setVideoData } from "./store/videoSlice";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;

  const fetchUserProfileData = async () => {
    try {
      const response = await axios.get(`/api/v1/users/c/${userData?.username}`);
      if (response.status === 200) {
        dispatch(setUserProfileData(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching profile data: ", error);
    }
  };

  const fetchUserVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/dashboard/videos`);
      if (response.status === 200) {
        dispatch(setUserVideos(response.data.data));
      }
    } catch (error) {
      setVideoError(error.response.data);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get("/api/v1/dashboard/posts");
      if (response.status === 200) {
        dispatch(setUserPosts(response.data.data));
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const getAllVideos = async (userData) => {
    if (userData) {
      try {
        const response = await axios.get(`/api/v1/videos`);
        if (response.status === 200) {
          dispatch(setVideoData(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching videos: ", error);
      }
    }
  };

  useEffect(() => {
    getAllVideos(userData);
    fetchUserProfileData();
    fetchUserPlaylists();
    fetchUserVideos();
    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPlaylists());
      dispatch(fetchUserLikedVideos());
      dispatch(fetchUserWatchHistory());
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
