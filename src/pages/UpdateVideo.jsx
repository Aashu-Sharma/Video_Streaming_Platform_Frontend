import { fetchVideoById } from "@/store/videoSlice.js";
import { VideoForm } from "../components/index.js";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

function UpdateVideo() {
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const videoTobeUpdated = useSelector((state) => state.videos.video);

  useEffect(() => {
    dispatch(fetchVideoById(videoId));
  }, [videoId])

  return (
    <div className="bg-black w-full min-h-screen">
      <VideoForm video={videoTobeUpdated}/>
    </div>
  );
}

export default UpdateVideo;
