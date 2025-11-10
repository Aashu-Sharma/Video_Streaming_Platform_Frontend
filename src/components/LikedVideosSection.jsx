import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Section, VideoCard } from "./index.js";
import { Link } from "react-router-dom";
import { deviceWidth, truncate } from "../utils/index.js";
import { usePagination } from "../hooks/index.js";

function LikedVideosSection() {
  const isMobile = deviceWidth();
  const likedVideos = useSelector((state) => state.auth.likedVideos);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);

  const { activeHistory, canMoveLeft, canMoveRight, moveLeft, moveRight } =
    usePagination(likedVideos, isMobile ? 2 : 4, 10);
  return (
    <Section
      sectionTitle={"Your Liked Videos"}
      canMoveLeft={canMoveLeft}
      canMoveRight={canMoveRight}
      moveLeft={moveLeft}
      moveRight={moveRight}
      viewAllRoute={`/allLikedVideos`}
    >
      {activeHistory?.map((video) => (
        <Link
          to={`/video/${video._id}`}
          key={video._id}
          className={`${isMobile ? "w-1/2" : "w-full"}  overflow-hidden`}
        >
          {/* <div
            className="w-full border rounded-lg overflow-hidden"
            onMouseEnter={() => setHoveredVideoId(video._id)}
            onMouseLeave={() => setHoveredVideoId(null)}
          >
            <div
              className={`thumbnailContainer relative w-full aspect-video overflow-hidden`}
            >
              {hoveredVideoId === video._id ? (
                <video
                  src={video.videoFile}
                  autoPlay
                  loop
                  className="w-full h-full object-cover border"
                />
              ) : (
                <img
                  src={video.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover rounded-t-lg border "
                />
              )}

            </div>
            <div
              className={`video-details w-full flex justify-between items-center`}
            >
              <div className="flex  items-center gap-2 p-3 "> 
                <div
                  className={`Profile-image-circle ${
                    isMobile ? "w-6 h-6" : "w-8 h-8"
                  }  rounded-full border overflow-hidden `}
                >
                  <img
                    src={video.owner.avatar}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`flex flex-col `}>
                  <p
                    className={`${
                      isMobile ? "text-sm" : "text-base "
                    } text-gray-200 font-bold`}
                  >
                    {truncate(video.title, isMobile ? 15 : 20)}
                  </p>
                  <p className="text-sm text-gray-400 font-semibold ">
                    {video.owner.username.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div> */}
          <VideoCard
            elem={video}
            className={"border"}
            titleLength={isMobile ? 20 : 25}
            textsize={isMobile ? "text-sm" : "text-base"}
          />
        </Link>
      ))}
    </Section>
  );
}

export default LikedVideosSection;
