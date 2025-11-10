import { deviceWidth} from "../utils/index.js";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { VideoCard } from "../components/index.js";
import { removeVideoFromWatchHistory } from "../store/watchHistorySlice.js";

function History() {
  const isMobile = deviceWidth();
  const dispatch = useDispatch();
  const watchHistory = useSelector((state) => state.watchHistory.history);
  console.log("WatchHistory in History page: ", watchHistory);
  const handleRemove = (videoId) => {
    dispatch(removeVideoFromWatchHistory(videoId))
  }

  if (!watchHistory || watchHistory?.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
        No watch history yet.
      </div>
    );
  }

  return (
    <div className="container w-full min-h-screen flex flex-col gap-2 p-4">
      <div>
        <h1 className="text-4xl text-white mb-4 font-bold">History</h1>
        <hr />
      </div>
      {watchHistory?.map((watched) => (
        <Link
          key={watched._id}
          to={`/video/${watched._id}`}
          className="w-full overflow-hidden mt-4 "
        >
          <VideoCard
            elem={watched}
            className={"flex flex-row gap-2 "}
            thumbnailOrVideoContainerClassName={`${
              isMobile ? "w-40" : "w-64"
            } flex-shrink-0`}
            showDescription={true}
            textsize={isMobile ? "text-sm" : "text-base"}
            imgClassName={"rounded-lg"}
            videoClassName = {"rounded-lg"}
            variant="watchHistory"
            items={[
              {
                label: "Remove from WatchHistory",
                onClick: () => handleRemove(watched._id),
                className: "bg-red-400 text-black hover:bg-red-500"
              }
            ]}
          />
        </Link>
      ))}
    </div>
  );
}

export default History;
