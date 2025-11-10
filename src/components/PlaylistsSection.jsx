import React, { useState } from "react";
import { DropdownComp, PlaylistModal, Section } from "./index.js";
import { useDispatch, useSelector } from "react-redux";
import { deviceWidth, truncate } from "../utils/index.js";
import { Link } from "react-router-dom";
import { usePagination } from "../hooks/index.js";
import { EllipsisVertical } from "lucide-react";
import { deletePlaylist } from "../store/playlistSlice.js";
import { toast } from "react-toastify";

function PlaylistsSection() {
  const dispatch = useDispatch();
  const isMobile = deviceWidth();
  const { userPlaylists, status, error } = useSelector(
    (state) => state.playlists
  );
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null);
  const [displayForm, setDisplayForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const editPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
    setDisplayForm((prev) => !prev);
  };

  const playlists = userPlaylists ? userPlaylists : [];
  const { activeHistory, canMoveLeft, canMoveRight, moveLeft, moveRight } =
    usePagination(playlists, isMobile ? 2 : 4, 10);

  const setCardWidth = playlists?.length < 4 ? "w-[300px]": "w-full";
  const handleDelete = async (playlistId) => {
    try {
      await dispatch(deletePlaylist(playlistId)).unwrap();
      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(error?.message || "Failed to delete playlist");
    }
  };

  return (
    <Section
      sectionTitle={"Your Playlists"}
      canMoveLeft={canMoveLeft}
      canMoveRight={canMoveRight}
      moveLeft={moveLeft}
      moveRight={moveRight}
      viewAllRoute={`/allPlaylists`}
    >
      {displayForm && (
        <PlaylistModal
          playlist={editingPlaylist}
          setDisplayForm={setDisplayForm}
        />
      )}
      {activeHistory?.map((playlist) => (
        <Link
          to={`/playlist/${playlist._id}`}
          key={playlist._id}
          className={`${isMobile ? "w-1/2" : setCardWidth}  overflow-hidden`}
        >
          <div
            className="w-full border rounded-lg overflow-hidden"
            onMouseEnter={() => setHoveredPlaylistId(playlist._id)}
            onMouseLeave={() => setHoveredPlaylistId(null)}
          >
            <div
              className={`thumbnailContainer relative w-full aspect-video overflow-hidden`}
            >
              {hoveredPlaylistId === playlist._id ? (
                <video
                  src={playlist.videos[0]?.videoFile}
                  autoPlay
                  loop
                  className="w-full h-full object-cover border"
                />
              ) : (
                <img
                  src={playlist.videos[0]?.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover rounded-t-lg border opacity-[0.3]"
                />
              )}

              <span className="absolute bottom-0 right-2 font-bold text-white ">
                {playlist.videos.length} videos
              </span>
            </div>
            <div
              className={`playlist-details w-full flex justify-between items-center`}
            >
              <div className="flex  items-center gap-2 p-3 ">
                <div
                  className={`Profile-image-circle ${
                    isMobile ? "w-6 h-6" : "w-8 h-8"
                  }  rounded-full border overflow-hidden `}
                >
                  <img
                    src={playlist.owner.avatar}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`flex flex-col `}>
                  <p
                    className={`${
                      isMobile ? "text-sm" : "text-base "
                    } text-gray-200 font-bold`}
                  >
                    {truncate(playlist.name, isMobile ? 15 : 20)}
                  </p>
                  <p className="text-sm text-gray-400 font-semibold ">
                    {playlist.owner.username.toUpperCase()}
                  </p>
                </div>
              </div>
              <DropdownComp
                trigger={<EllipsisVertical size={30} color="white" />}
                items={[
                  {
                    label: "Edit Playlist",
                    onClick: () => editPlaylist(playlist),
                    className: "w-full",
                  },
                  {
                    label: "Delete Playlist",
                    onClick: () => handleDelete(playlist._id),
                    className: "w-full bg-red-400 text-black hover:bg-red-500",
                  },
                ]}
                menuClassName={"w-60"}
              />
            </div>
          </div>
        </Link>
      ))}
    </Section>
  );
}

export default PlaylistsSection;
