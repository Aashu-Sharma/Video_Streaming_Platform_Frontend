import React, { useEffect } from "react";
import Profile from "../components/Profile.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchProfileData,
  fetchProfileVideos,
  fetchProfilePosts,
  setUserPosts
} from "../store/profileSlice.js";
import axios from 'axios';

function UserProfile() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.userData);
  let { profileData, profileVids, profilePosts } = useSelector(
    (state) => state.profile
  );

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(`/api/v1/tweets/${postId}`);
      profilePosts = profilePosts.filter((post) => post._id !== postId);
      dispatch(setUserPosts(profilePosts));
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(
        fetchProfileData({
          profileType: "user",
          username: loggedInUser.username,
        })
      );
    }
  }, [dispatch, loggedInUser?._id]);

  useEffect(() => {
    if (profileData) {
      dispatch(fetchProfileVideos({ profileType: "user" }));
      dispatch(fetchProfilePosts({ profileType: "user" }));
    }
  }, [dispatch, profileData]);

  if (!profileData || !profileVids || !profilePosts) {
    return <div className="text-center text-4xl text-white m-auto">Loading...</div>;
  }

  return (
    <div className="bg-black w-full h-full min-h-screen text-white">
      <Profile
        profileData={profileData}
        channelVideos={profileVids}
        channelPosts={profilePosts}
        deletePost={handleDelete}
      />
    </div>
  );
}

export default UserProfile;
