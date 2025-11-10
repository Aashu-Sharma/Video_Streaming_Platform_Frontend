import React, { useEffect } from "react";
import Profile from "../components/Profile.jsx";
import { useDispatch, useSelector } from "react-redux";
import {fetchProfileData, fetchProfileVideos, fetchProfilePosts} from '../store/profileSlice.js';

function UserProfile() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.userData);
  const userData = useSelector((state) => state.profile.profileData);
  const userVideos = useSelector((state) => state.profile.profileVids);
  const userPosts = useSelector((state) => state.profile.profilePosts);

  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(
        fetchProfileData({ profileType: "user", username: loggedInUser.username })
      );
      dispatch(fetchProfileVideos({ profileType: "user" }));
      dispatch(fetchProfilePosts({ profileType: "user" }));
    }
  }, [dispatch, loggedInUser?._id]);

  if (!userData) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-black w-full h-full min-h-screen text-white">
      <Profile
        profileData={userData}
        channelVideos={userVideos}
        channelPosts={userPosts}
      />
    </div>
  );
}

export default UserProfile;
