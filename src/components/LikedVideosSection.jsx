import React from "react";
import { useSelector } from "react-redux";
import { Section, VideoCard } from "./index.js";
import { Link } from "react-router-dom";
import { deviceWidth } from "../utils/index.js";
import { usePagination } from "../hooks/index.js";

function LikedVideosSection() {
  const isMobile = deviceWidth();
  const likedVideos = useSelector((state) => state.auth.likedVideos);

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
      {activeHistory?.map((video) =>
        video.isPublished ? (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className={`${isMobile ? "w-1/2" : "w-full"}  overflow-hidden`}
          >
            <VideoCard
              elem={video}
              className={"border"}
              titleLength={isMobile ? 20 : 25}
              textsize={isMobile ? "text-sm" : "text-base"}
            />
          </Link>
        ) : (
          <div
            key={video._id}
            className={`${isMobile ? "w-1/2" : "w-full"}  overflow-hidden`}
          >
            <VideoCard
              elem={video}
              className={"border"}
              titleLength={isMobile ? 20 : 25}
              textsize={isMobile ? "text-sm" : "text-base"}
            />
          </div>
        )
      )}
    </Section>
  );
}

export default LikedVideosSection;
