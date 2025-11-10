import React from "react";
import { useSelector } from "react-redux";
import { deviceWidth } from "../utils/index";
import {Link} from 'react-router-dom';
import {VideoCard} from '../components/index.js';

function AllLikedVideos() {
  const isMobile = deviceWidth();
  const likedVideos = useSelector((state) => state.auth.likedVideos);

  if (!likedVideos || likedVideos.length === 0) {
    return (
      <div className="text-lg text-white text-center">No videos to show..</div>
    );
  }
  return (
    <div className="container w-full min-h-screen flex flex-col gap-2 p-4">
      <div>
        <h1 className="text-4xl text-white mb-4 font-bold">Liked Videos</h1>
        <hr />
      </div>
      {likedVideos?.map((video) => (
        <Link
          key={video._id}
          to={`/video/${video._id}`}
          className="w-full overflow-hidden mt-4 "
        >
          <VideoCard
            elem={video}
            className={"flex flex-row gap-2 "}
            thumbnailOrVideoContainerClassName={`${
              isMobile ? "w-40" : "w-64"
            } flex-shrink-0`}
            showDescription={true}
            textsize={isMobile ? "text-sm" : "text-base"}
            imgClassName={"rounded-lg"}
            videoClassName={"rounded-lg"}
          />
        </Link>
      ))}
    </div>
  );
}

export default AllLikedVideos;
