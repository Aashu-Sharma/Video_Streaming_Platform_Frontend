import React, { useState } from "react";
import { deviceWidth, truncate } from "../utils/index.js";
import { Link } from "react-router-dom";
import { VideoCard } from "./index.js";

function ListVideos({ videoList, className }) {
  const isMobile = deviceWidth();
  // note: check how duration appears when the video is longer than 1 minutes
  // console.log("Channel Videos in ListVideos: ", videoList);
  return (
    <div
      className={`w-full h-full  ${
        isMobile ? className : className
      } p-4 `}
    >
      {videoList?.map((video) => (
        <Link key={video._id} to={`/video/${video._id}`}>
          <VideoCard
            elem={video}
            className={"border"}
            titleLength={40}
            textsize={isMobile ? "text-sm" : "text-base"}
            imgClassName={"rounded-t-lg"}
            videoClassName={"rounded-t-lg"}
          />
        </Link>
      ))}
    </div>
  );
}

export default ListVideos;
