import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import { deviceWidth, truncate } from "../utils/index.js";
import { PlaylistModal, VideoCard } from "../components/index.js";
import { Pencil, Trash } from "lucide-react";
import {
  deletePlaylist,
  removeVideoFromPlaylist,
} from "../store/playlistSlice.js";
import { toast } from "react-toastify";

function PlaylistVideos() {
  const dispatch = useDispatch();
  const isMobile = deviceWidth();
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { userPlaylists, status, error, statusCode } = useSelector(
    (state) => state.playlists
  );
  const playlist = userPlaylists?.find(
    (playlist) => playlist._id === playlistId
  );

  const [displayForm, setDisplayForm] = useState(false);
  const [viewMore, setViewMore] = useState(false);

  const handleDelete = async (playlistId) => {
    try {
      await dispatch(deletePlaylist(playlistId)).unwrap();
      toast.success("Playlist deleted successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(error?.message || "Failed to delete playlist");
    }
  };

  const handleRemoveVideo = async (playlistId, videoId) => {
    try {
      await dispatch(removeVideoFromPlaylist({ playlistId, videoId })).unwrap();
      toast.success("successfully removed the video");
    } catch (error) {
      console.error("Error removing video from playlist:", error);
      toast.error(error?.message || "Failed to remove video");
    }
  };

  return (
    <div
      className={`w-full h-full flex ${
        isMobile ? "flex-col gap-4" : "flex-row gap-4 "
      }  p-4 `}
    >
      {displayForm && (
        <PlaylistModal playlist={playlist} setDisplayForm={setDisplayForm} />
      )}

      <div
        className={`Playlist-details-section ${
          isMobile ? "w-full" : "w-1/3  "
        }   flex flex-col gap-4  rounded-lg`}
      >
        <div className="thumbNailContainer w-full aspect-video overflow-hidden border rounded-lg">
          <img
            src={playlist?.videos[0].thumbnail}
            className="w-full h-full object-cover rounded-lg  "
          />
        </div>
        <h1 className="text-white text-3xl font-bold">{playlist?.name}</h1>
        <div className="lower-part w-full flex flex-col gap-4 ">
          <div className="w-full flex items-center justify-between text-white">
            <div className="flex flex-row gap-2 ">
              <div
                className={
                  "Profile-image-circle w-6 h-6 rounded-full border overflow-hidden "
                }
              >
                <img
                  src={playlist?.owner.avatar}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-white text-sm">
                  {playlist?.owner.username.toUpperCase()}
                </p>
                <p className="font-bold text-white text-sm">
                  {playlist?.videos.length} videos
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div onClick={() => setDisplayForm((prev) => !prev)}>
                <Pencil size={30} color="white" />
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(playlistId);
                }}
              >
                <Trash />
              </div>
            </div>
          </div>

          <div className="description">
            {!viewMore ? (
              <div className="text-white text-sm relative">
                <p>{truncate(playlist?.description, 50)}</p>
                <span
                  className="cursor-pointer font-bold absolute bottom-[-10] right-0"
                  onClick={() => setViewMore(true)}
                >
                  View More
                </span>
              </div>
            ) : (
              <div className="text-white text-sm relative">
                <p>{playlist?.description}</p>
                <span
                  className="cursor-pointer font-bold absolute bottom-[-10] right-0"
                  onClick={() => setViewMore(false)}
                >
                  View less
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`playlist-videos ${
          isMobile ? "w-full" : "w-2/3"
        }  flex flex-col gap-4 `}
      >
        {playlist?.videos.map((video) => (
          <Link
            key={video._id}
            to={`/video/${video._id}`}
            className="w-full overflow-hidden  "
          >
            <VideoCard
              elem={video}
              className={"flex flex-row gap-2 "}
              thumbnailOrVideoContainerClassName={`${
                isMobile ? "w-32" : "w-64"
              } flex-shrink-0`}
              showDescription={false}
              videoClassName={"rounded-lg"}
              imgClassName={"rounded-lg"}
              variant="Playlists"
              items={[
                {
                  label: "Remove Video From Playlist",
                  onClick: () => handleRemoveVideo(playlistId, video._id),
                  className: "bg-red-500 w-full",
                },
              ]}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PlaylistVideos;
