import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Profile } from "../components/index.js";
import {
  clearAllPreviousData,
  fetchProfileData,
  fetchProfilePosts,
  fetchProfileVideos,
} from "../store/profileSlice.js";
import { useDispatch, useSelector } from "react-redux";

function ChannelProfile() {
  const { user } = useParams();
  const channelProfileData = useSelector((state) => state.profile.profileData);
  const channelVideos = useSelector((state) => state.profile.profileVids);
  const channelPosts = useSelector((state) => state.profile.profilePosts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfileData({ profileType: "channel", username: user }));
    return () => {
      dispatch(clearAllPreviousData());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (channelProfileData) {
      dispatch(
        fetchProfileVideos({
          profileType: "channel",
          userId: channelProfileData._id,
        })
      );
      dispatch(
        fetchProfilePosts({
          profileType: "channel",
          userId: channelProfileData._id,
        })
      );
    }
  }, [dispatch, channelProfileData]);
  return (
    <div className="bg-black w-full h-full min-h-screen text-white">
      <Profile
        profileData={channelProfileData}
        channelVideos={channelVideos}
        channelPosts={channelPosts}
        user={user}
      />
    </div>
  );
}

export default ChannelProfile;
