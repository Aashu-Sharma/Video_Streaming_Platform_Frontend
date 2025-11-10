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

  // const fetchchannelProfile = async () => {
  //   try {
  //     const response = await axios.get(`/api/v1/users/c/${user}`);
  //     if (response.status === 200) {
  //       console.log("ChannelData: ", response.data.data);
  //       setChannelProfileData(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error(error.response.data);
  //   }
  // };
  // const fetchchannelVideos = async (userId) => {
  //   try {
  //     const response = await axios.get(`/api/v1/videos`, {
  //       params: { userId },
  //     });
  //     if (response.status === 200) {
  //       console.log("ChannelVideos: ", response.data.data);
  //       setChannelVideos(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error(error.response.data);
  //   }
  // };
  // const fetchchannelPosts = async (userId) => {
  //   try {
  //     const response = await axios.get(`/api/v1/tweets/user/${userId}`);
  //     if (response.status === 200) {
  //       console.log("ChannelPosts: ", response.data.data);
  //       setChannelPosts(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error(error.response.data);
  //   }
  // }

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
