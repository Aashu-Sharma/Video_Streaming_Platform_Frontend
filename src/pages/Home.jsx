import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ListVideos } from "../components/index.js";
import deviceWidth from "../utils/deviceWidth.js";

function Home() {
  const userData = useSelector((state) => state.auth.userData);
  const { videos, status } = useSelector((state) => state.videos);

  const isMobile = deviceWidth();
  const publicVideos = videos?.filter(video => video.isPublished !== false);

  if (!userData)
    return (
      <p className="m-auto text-4xl text-white text-center">
        Please log in to access your account.
      </p>
    );

  if (videos.length === 0)
    return (
      <p className="m-auto text-4xl text-white text-center">
        {status === "loading" ? "Loading videos..." : "No videos available."}
      </p>
    );

  return (
    <div className="text-white w-full h-full">
      <ListVideos
        videoList={publicVideos}
        className={
          isMobile ? "flex flex-col gap-4" : "grid grid-cols-3 gap-4"
        }
      />
    </div>
  );
}

export default Home;
