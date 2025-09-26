import React, { useState } from "react";
import deviceWidth from "../utils/deviceWidth.js";
import { Link } from "react-router-dom";

function ListVideos({ videoList, className }) {
  const isMobile = deviceWidth();
  const [hoveredVideoId, setHoveredVideoId] = useState(null);

  function truncate(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  }

  // note: check how duration appears when the video is longer than 1 minutes
  // console.log("Channel Videos in ListVideos: ", videoList);
  return (
    <div
      className={`w-full h-full  ${
        // isMobile ? className : " grid-cols-3 gap-4"
        isMobile ? className : className
      } p-4 `}
    >
      {videoList.map((video) => (
        <Link key={video._id} to={`/video/${video._id}`}>
          <div
            className="w-full rounded-lg hover:scale-105 hover:shadow-gray-200 hover-shadow-lg transition-all duration-300 "
            onMouseEnter={() => setHoveredVideoId(video._id)}
            onMouseLeave={() => setHoveredVideoId(null)}
          >
            <div className="thumbnailContainer w-full h-[70%] overflow-hidden ">
              {hoveredVideoId === video._id ? (
                <video
                  src={video.videoFile}
                  autoPlay
                  controls
                  loop
                  className="w-full h-full object-cover border"
                />
              ) : (
                <img
                  src={video?.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover rounded-t-lg border"
                />
              )}
            </div>
            <div className="lower-part w-full  py-2 flex flex-row items-center gap-2">
              <div className="Profile-image-circle w-[40px] h-[40px] rounded-full border overflow-hidden ">
                <img
                  src={video.owner.avatar}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="videoDetails p-2">
                <p>{truncate(video.title, 25)}</p>
                <p className="font-bold ">
                  {video.owner.username.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ListVideos;
