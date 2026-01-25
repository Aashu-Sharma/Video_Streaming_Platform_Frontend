import React, { useEffect, useState } from "react";
import { EllipsisVertical, Plus, ThumbsUp } from "lucide-react";
import { checkTimePassed } from "../utils/timeFormatter.js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Comments, DropdownComp } from "./index.js";
import deviceWidth from "../utils/deviceWidth.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserLikedVideos } from "../store/authSlice.js";
import { deleteVideo } from "../store/videoSlice.js";
import { toast } from "react-toastify";
import { removeVideoFromWatchHistory } from "../store/watchHistorySlice.js";
import { removeVideoFromAllPlaylists } from "../store/playlistSlice.js";

function VideoSection({
  videoToBePlayed,
  currentUserData,
  fetchVideoById,
  inMobileDisplayAllComments,
  setInMobileDisplayAllComments,
}) {
  const dispatch = useDispatch();
  const likedVideos = useSelector((state) => state.auth.likedVideos);
  const [disableSubscribe, setDisableSubscribed] = useState(false);
  const [subscribed, setSubscribed] = useState(null);
  const [isliked, setLiked] = useState(false);
  const [likesCount, setliksCount] = useState(null);
  const [videoTime, setVideoTime] = useState(null);
  const isMobile = deviceWidth();
  const userId = useSelector((state) => state.auth.userData)?._id;
  const navigate = useNavigate();
  const playlists = useSelector((state) => state.playlists.userPlaylists);

  const likedVideodIds = likedVideos?.map((video) => video._id);

  const showPublishedTime = () => {
    if (videoToBePlayed?.createdAt) {
      const response = checkTimePassed(videoToBePlayed?.createdAt);
      setVideoTime(response);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await dispatch(deleteVideo(videoId)).unwrap();
      await dispatch(removeVideoFromWatchHistory(videoId)).unwrap();
      await dispatch(removeVideoFromAllPlaylists(videoId)).unwrap();
      if(likedVideodIds?.includes(videoId)){
        await axios.post(`/api/v1/likes/toggle/v/${videoId}`);
      }
      toast.success("Video successfully deleted");
      navigate("/");
    } catch (error) {
      toast.error(error?.message || `Failed to update password`);
    }
  };

  const checkIfSubscribed = async (channelId) => {
    try {
      const response = await axios.get(
        `/api/v1/subscriptions/check/${channelId}`
      );
      setSubscribed(response.data.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const toggleSubscribe = async (channelId) => {
    try {
      const response = await axios.post(`/api/v1/subscriptions/c/${channelId}`);
      if (response.status === 201) {
        setSubscribed(true);
        await fetchVideoById();
      }
      if (response.status === 200) {
        setSubscribed(false);
        await fetchVideoById();
      }
    } catch (error) {
      console.error("Error subscribing the channel: ", error);
    }
  };

  const isUserOwner = () => {
    if (currentUserData?._id === videoToBePlayed?.owner._id) {
      return true;
    } else {
      return false;
    }
  };

  const toggleLike = async (videoId) => {
    try {
      const response = await axios.post(`/api/v1/likes/toggle/v/${videoId}`);
      setLiked((prev) => !prev);
      getLikesCount(videoToBePlayed?._id);
      dispatch(fetchUserLikedVideos());
    } catch (error) {
      console.error("Error adding like: ", error);
    }
  };

  const getLikesCount = async (videoId) => {
    if (videoId) {
      try {
        const response = await axios.post(
          `/api/v1/likes/toggle/v/likes/${videoId}`
        );
        setliksCount(response.data.data);
      } catch (error) {
        console.error("Error adding like: ", error);
      }
    }
  };

  useEffect(() => {
    isUserOwner();
    showPublishedTime();
    getLikesCount(videoToBePlayed?._id);
    setDisableSubscribed(isUserOwner());
    if (videoToBePlayed?.owner?._id) {
      checkIfSubscribed(videoToBePlayed?.owner?._id);
    }
  }, [videoToBePlayed]);

  return (
    <div
      className={`Container flex flex-col gap-4 p-4 ${
        isMobile ? "w-full" : "w-[60%] "
      }  `}
    >
      <div className={`videoContainer w-full ${isMobile ? "max-h-[300px]" : "max-h-[500px]"}  rounded-lg `}>
        <video
          src={videoToBePlayed?.videoFile}
          className="w-full h-full rounded-lg border "
          controls
          autoPlay
        />
      </div>

      {isMobile && inMobileDisplayAllComments ? (
        <Comments
          currentVideoId={videoToBePlayed?._id}
          inMobileDisplayAllComments={inMobileDisplayAllComments}
          setInMobileDisplayAllComments={setInMobileDisplayAllComments}
        />
      ) : (
        <div className="videoInformation flex flex-col gap-4">
          <div className="titleAndDescription">
            <h2 className="font-bold text-xl">{videoToBePlayed?.title}</h2>
            <p>{videoToBePlayed?.description}</p>
          </div>
          <div className="Details&interactions w-full flex items-center justify-between">
            <div className="channelDetails flex flex-row gap-2 items-center justify-center ">
              <Link to={`/${videoToBePlayed?.owner?.username}`}>
                <div className="Profile-image-circle w-[40px] h-[40px] rounded-full border overflow-hidden ">
                  <img
                    src={videoToBePlayed?.owner.avatar}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex-col gap">
                <h3>{videoToBePlayed?.owner.username.toUpperCase()}</h3>
                <h3>Subscribers: {videoToBePlayed?.owner.subscribersCount}</h3>
              </div>
              {!disableSubscribe && (
                <div
                  className={`subscribeButton ${
                    subscribed !== null && subscribed && "bg-white text-black"
                  } w-[100px] p-2 text-center text-lg border rounded-full`}
                >
                  <button
                    disabled={disableSubscribe}
                    onClick={() => toggleSubscribe(videoToBePlayed?.owner._id)}
                  >
                    {subscribed !== null && subscribed
                      ? "Subscribed"
                      : "Subscribe"}
                  </button>
                </div>
              )}
            </div>
            <div className="interactions flex items-center justify-between gap-2">
              <div
                className="likes flex border text-base rounded-4xl w-[80px] items-center justify-center py-2 gap-2"
                onClick={() => {
                  toggleLike(videoToBePlayed?._id);
                }}
              >
                <ThumbsUp
                  className={
                    isliked ? "text-white scale-110" : `bg-transparent`
                  }
                />
                <p>{likesCount}</p>
              </div>

              <Link to={`/video/${videoToBePlayed?._id}/addToPlaylist`}>
                <div className="addToPlaylist flex border text-white text-base rounded-4xl w-[150px] items-center justify-center py-2 gap-2">
                  <Plus />
                  <p>Add to playlist</p>
                </div>
              </Link>

              {videoToBePlayed?.owner?._id === userId && (
                <DropdownComp
                  trigger={<EllipsisVertical size={30} />}
                  items={[
                    {
                      label: "Edit Video",
                      link: `/edit-video/${videoToBePlayed?._id}`,
                      className:
                        "w-full bg-black rounded-lg text-white text-center p-2",
                    },
                    {
                      label: "Delete Video",
                      onClick: () => handleDelete(videoToBePlayed._id),
                      className:
                        "w-full bg-red-400 text-black hover:bg-red-500",
                    },
                  ]}
                  menuClassName={"w-60"}
                />
              )}
            </div>
          </div>

          <div className="videoDetails">
            <p>Views: {videoToBePlayed?.views}</p>
            <p>Published: {videoTime}</p>
            <p></p>
          </div>

          <div className="comments">
            <Comments
              currentVideoId={videoToBePlayed?._id}
              inMobileDisplayAllComments={inMobileDisplayAllComments}
              setInMobileDisplayAllComments={setInMobileDisplayAllComments}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoSection;
