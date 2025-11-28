import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Profile } from "../components/index.js";
import {
  clearAllPreviousData,
  fetchProfileData,
} from "../store/profileSlice.js";
import {
  fetchProfilePosts,
  setUserPosts,
  clearPosts,
} from "../store/postSlice.js";
import { useDispatch, useSelector } from "react-redux";

function ChannelProfile() {
  const { user } = useParams();
  const channelProfileData = useSelector((state) => state.profile.profileData);
  const channelPosts = useSelector((state) => state.posts.posts);
  const videos = useSelector((state) => state.videos.videos);

  const channelVideos = videos?.filter(
    (video) => video.owner._id === channelProfileData?._id
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfileData({ profileType: "channel", username: user }));
    return () => {
      dispatch(clearAllPreviousData());
      dispatch(clearPosts());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (channelProfileData) {
      dispatch(
        fetchProfilePosts({
          profileType: "channel",
          userId: channelProfileData._id,
        })
      );
    }
  }, [dispatch, channelProfileData]);

  if (!channelProfileData || !channelVideos || !channelPosts) {
    return (
      <div className="text-center text-4xl m-auto text-gray-500">
        Loading...
      </div>
    );
  }

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
