import React, { useEffect } from "react";
import Profile from "../components/Profile.jsx";
import { useDispatch, useSelector } from "react-redux";
import {fetchProfileData, fetchProfileVideos, fetchProfilePosts} from '../store/profileSlice.js';

function UserProfile() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.userData);
  const {profileData, profileVids, profilePosts } = useSelector((state) => state.profile);

  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(
        fetchProfileData({ profileType: "user", username: loggedInUser.username })
      );
      dispatch(fetchProfileVideos({ profileType: "user" }));
      dispatch(fetchProfilePosts({ profileType: "user" }));
    }
  }, [dispatch, loggedInUser?._id]);

  if (!profileData) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-black w-full h-full min-h-screen text-white">
      <Profile
        profileData={profileData}
        channelVideos={profileVids}
        channelPosts={profilePosts}
      />
    </div>
  );
}

export default UserProfile;
