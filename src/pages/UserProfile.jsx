import React, { useEffect } from "react";
import Profile from "../components/Profile.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchProfileData,
  clearAllPreviousData,
} from "../store/profileSlice.js";
import {
  fetchProfilePosts,
  setUserPosts,
  clearPosts,
} from "../store/postSlice.js";
import axios from "axios";

function UserProfile() {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.videos);
  const loggedInUser = useSelector((state) => state.auth.userData);
  const profileData = useSelector((state) => state.profile.profileData);
  let posts = useSelector((state) => state.posts.posts);
  const profileVids = videos?.filter(
    (video) => video.owner._id === profileData?._id
  );

  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(
        fetchProfileData({
          profileType: "user",
          username: loggedInUser.username,
        })
      );
    }
    return () => {
      dispatch(clearAllPreviousData());
      dispatch(clearPosts());
    };
  }, [dispatch, loggedInUser?._id]);

  useEffect(() => {
    if (profileData) {
      dispatch(fetchProfilePosts({ profileType: "user" }));
    }
  }, [dispatch, profileData]);

  if (!profileData || !profileVids || !posts) {
    return (
      <div className="text-center text-4xl text-white m-auto">Loading...</div>
    );
  }

  return (
    <div className="bg-black w-full h-full min-h-screen text-white">
      <Profile
        profileData={profileData}
        channelVideos={profileVids}
        channelPosts={posts}
      />
    </div>
  );
}

export default UserProfile;
