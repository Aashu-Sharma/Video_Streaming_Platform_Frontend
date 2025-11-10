import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListPlaylists, PlaylistModal } from "../components/index.js";
import { deviceWidth } from "../utils/index.js";
import { deletePlaylist } from "../store/playlistSlice.js";
import { toast } from "react-toastify";

function AllPlaylists() {
  const isMobile = deviceWidth();
  const dispatch = useDispatch();
  const { userPlaylists, status, error } = useSelector(
    (state) => state.playlists
  );
  const playlists = userPlaylists ? userPlaylists : [];
  const [displayForm, setDisplayForm] = useState(false);
  const [editingPlaylist, seetEditingPlaylist] = useState(null);
  console.log("UserPlaylists: ", playlists);

  const editPlaylist = (playlist) => {
    seetEditingPlaylist(playlist);
    setDisplayForm((prev) => !prev);
  };

  const handleDelete = async(playlistId) => {
    try {
      await dispatch(deletePlaylist(playlistId)).unwrap();
      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(error?.message || "Failed to delete playlist");
    }
  };

  if (!playlists || playlists.length === 0) {
    return (
      <div className="text-lg text-white text-center">
        No Playlists to show..
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen">
      {displayForm && (
        <PlaylistModal
          playlist={editingPlaylist}
          setDisplayForm={setDisplayForm}
        />
      )}
      <ListPlaylists
        playlists={playlists}
        className={
          isMobile ? "grid grid-cols-1 gap-2" : "grid grid-cols-3 gap-4"
        }
        handleDelete={handleDelete}
        editPlaylist={editPlaylist}
      />
    </div>
  );
}

export default AllPlaylists;
