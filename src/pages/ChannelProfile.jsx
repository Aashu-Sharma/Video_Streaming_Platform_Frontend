import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {Profile} from '../components/index.js';

function ChannelProfile() {
  const { user } = useParams();
  const [channelProfileData, setChannelProfileData] = useState({});
  const [channelVideos, setChannelVideos] = useState([]);
  const fetchchannelProfile = async () => {
    try {
      const response = await axios.get(`/api/v1/users/c/${user}`);
      if (response.status === 200) {
        console.log("ChannelData: ", response.data.data);
        setChannelProfileData(response.data.data);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };
  const fetchchannelVideos = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/videos`, {
        params: { userId },
      });
      if (response.status === 200) {
        console.log("ChannelVideos: ", response.data.data);
        setChannelVideos(response.data.data);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchchannelProfile();
    if (channelProfileData) {
      fetchchannelVideos(channelProfileData?._id);
    }
  }, [user]);
  return (
    <div className="bg-black w-full h-full min-h-screen text-white">
      <Profile profileData={channelProfileData} channelVideos={channelVideos} user = {user} />
    </div>
  );
}

export default ChannelProfile;
