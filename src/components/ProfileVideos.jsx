import React from "react";
import { useOutletContext } from "react-router-dom";
import { ListVideos } from "./index.js";
import deviceWidth from "../utils/deviceWidth.js";

function ProfileVideos() {
  const {channelVideos} = useOutletContext();
  const isMobile = deviceWidth();
  return (
    <div className="w-full h-full">
      <ListVideos
        videoList={channelVideos}
        className={
          isMobile ? "grid grid-cols-1 gap-2" : "grid grid-cols-3 gap-4"
        }
      />
    </div>
  );
}

export default ProfileVideos;
