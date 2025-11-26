import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ListVideos } from "./index.js";
import deviceWidth from "../utils/deviceWidth.js";
import { useSelector } from "react-redux";

function ProfileVideos() {
  const { channelVideos, profileData } = useOutletContext();
  const [filter, setFilter] = useState(true);
  const isMobile = deviceWidth();
  const userData = useSelector((state) => state.auth.userData);
  const isUserProfile = profileData?._id === userData?._id;

  const filteredVideos = channelVideos?.filter(
    (video) => video.isPublished === filter
  );

  return (
    <div className={`w-full h-full ${isUserProfile && "flex flex-col gap"} `}>
      {isUserProfile && (
        <select className="w-[150px] ml-4 mt-2 p-2 bg-gray-800 text-white rounded-md border border-gray-600" 
        onChange={(e) => setFilter(e.target.value === "true")}
        >
          <option value="true">Public</option>
          <option value="false">Private</option>
        </select>
      )}
      <ListVideos
        videoList={filteredVideos}
        className={
          isMobile ? "grid grid-cols-1 gap-2" : "grid grid-cols-3 gap-4"
        }
      />
    </div>
  );
}

export default ProfileVideos;
