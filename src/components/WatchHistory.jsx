import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceWidth } from "../utils/index.js";
import { Link } from "react-router-dom";
import { usePagination } from "../hooks/index.js";
import { Section, VideoCard } from "./index.js";
import { removeVideoFromWatchHistory } from "../store/watchHistorySlice.js";

function WatchHistory() {
  const isMobile = deviceWidth();
  const dispatch = useDispatch();
  const watchHistory = useSelector((state) => state.watchHistory.history);
  const { activeHistory, canMoveLeft, canMoveRight, moveLeft, moveRight } =
    usePagination(watchHistory, isMobile ? 2 : 4, 10);
  const setCardWidth = watchHistory?.length < 4 ? "w-[300px]" : "w-full";

  const handleRemove = (videoId) => {
    dispatch(removeVideoFromWatchHistory(videoId));
  };

  return (
    <Section
      sectionTitle={"Watch History"}
      canMoveLeft={canMoveLeft}
      canMoveRight={canMoveRight}
      moveLeft={moveLeft}
      moveRight={moveRight}
      viewAllRoute={`/history`}
    >
      {activeHistory?.map((watched) => (
        <Link
          to={`/video/${watched._id}`}
          key={watched._id}
          className={`${isMobile ? "w-1/2" : setCardWidth}  overflow-hidden`}
        >
          <VideoCard
            elem={watched}
            className={"border"}
            titleLength={isMobile ? 15 : 20}
            textsize={isMobile ? "text-sm" : "text-base"}
            variant={"watchHistory"}
            items={[
              {
                label: "Remove from WatchHistory",
                onClick: () => handleRemove(watched._id),
                className: "bg-red-400 text-black hover:bg-red-500",
              },
            ]}
          />
        </Link>
      ))}
    </Section>
  );
}

export default WatchHistory;
