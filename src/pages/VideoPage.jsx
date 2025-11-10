import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ListVideos } from "../components/index.js";
import { VideoSection } from "../components/index.js";
import deviceWidth from "../utils/deviceWidth.js";
import {fetchUserWatchHistory} from '../store/watchHistorySlice.js';

function VideoPage() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.videos);
  const currentUserData = useSelector((state) => state.auth.userData);
  const watchHistory = useSelector((state) => state.watchHistory.history);
  const [videoToBePlayed, setVideoToBePlayed] = useState(null);
  const [videoList, setVideoList] = useState(null);
  const [inMobileDisplayAllComments, setInMobileDisplayAllComments] =
    useState(false);
  const isMobile = deviceWidth();

  const fetchVideoById = async () => {
    try {
      const response = await axios.get(`/api/v1/videos/${videoId}`);
      if (response.status === 200) {
        setVideoToBePlayed(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching video by id: ", error);
    }
  };

  const removeVideoBeingWatched = () => {
    const videosToBedisplayed = videos?.filter(
      (video) => video?._id !== videoToBePlayed?._id
    );
    console.log("Videostobedisplayed: ", videosToBedisplayed);
    setVideoList(videosToBedisplayed);
  };

  useEffect(() => {
    fetchVideoById();
  }, [videoId]);

  useEffect(() => {
    if(videoToBePlayed){
      dispatch(fetchUserWatchHistory());
    }
  }, [videoToBePlayed])

  console.log("Watch History in Video Page: ", watchHistory);

  useEffect(() => {
    removeVideoBeingWatched();
  }, [videoToBePlayed, videos]);

  if (!videoToBePlayed && !videoList)
    return <p className="text-4xl text-center m-auto text-white">Loading...</p>;
  else {
    return (
      <div
        className={`relative w-full h-full flex  ${
          isMobile ? "flex-col gap-2" : "justify-between"
        } text-gray-200`}
      >
        <Outlet />

        <VideoSection
          videoToBePlayed={videoToBePlayed}
          currentUserData={currentUserData}
          fetchVideoById={fetchVideoById}
          inMobileDisplayAllComments={inMobileDisplayAllComments}
          setInMobileDisplayAllComments={setInMobileDisplayAllComments}
        />

        {/* {isMobile && inMobileDisplayAllComments ? (
          <div></div>
        ) : (
          <div className={`sideDisplay ${isMobile ? "w-full" : "w-[39%]"}  `}>
            {videoList && (
              <ListVideos
                videoList={videoList}
                className={`flex flex-col gap-2`}
              />
            )}
          </div>
        )} */}

        {
          !inMobileDisplayAllComments &&(
            <div className={`sideDisplay ${isMobile ? "w-full" : "w-[39%]"}  `}>
            {videoList && (
              <ListVideos
                videoList={videoList}
                className={`flex flex-col gap-2`}
              />
            )}
          </div>
          )
        }
      </div>
    );
  }
}

export default VideoPage;
