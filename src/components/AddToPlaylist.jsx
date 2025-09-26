import axios from "axios";
import { Pencil, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FormInput } from "./index.js";
import { useForm } from "react-hook-form";
import {setUserPlaylists} from '../store/authSlice.js';

function AddToPlaylist() {
  const userPlaylists = useSelector((state) => state.auth.userPlaylists);
  const [playlistData, setPlaylistData] = useState(null);
  const [checkedPlaylists, setCheckedPlaylists] = useState({});
  const [displayForm, setDisplayForm] = useState(false);
  const { videoId } = useParams();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const CheckIfVideoExistsinPlaylists = () => {
    const updatedChecked = {};
    userPlaylists.forEach((playlist) => {
      const exists = playlist.videos.some((video) => video._id === videoId);
      if (exists) updatedChecked[playlist._id] = exists;
    });
    setCheckedPlaylists(updatedChecked);
  };

  const addOrRemoveVideoFromPlaylist = async (playlistId, e) => {
    const isChecked = e.target.checked;
    try {
      if (!e.target.checked) {
        const response = await axios.patch(
          `/api/v1/playlist/remove/${videoId}/${playlistId}`
        );
        console.log("Response: ", response.data);
        console.log("Success Message: ", response.data.message);
        toast.success(response.data.message);
      } else {
        const response = await axios.patch(
          `/api/v1/playlist/add/${videoId}/${playlistId}`
        );
        console.log("Response: ", response.data);
        console.log("Success Message: ", response.data.message);
        toast.success(response.data.message);
      }

      setCheckedPlaylists((prev) => ({
        ...prev,
        [playlistId]: isChecked,
      }));
    } catch (error) {
      console.log(error.status);
      console.log(error.data.message);
      toast.error(error.data.message);
    }
  };

  const createPlaylist = async (data) => {
    let rawData = {
      name: data.name,
      description: data.description,
    };

    console.log("rawData: ", rawData);
    try {
      const response = await axios.post(`/api/v1/playlist`, rawData);
      console.log("Playlist Response: ", response.data);
      if (response.status === 201) {
        setPlaylistData(response.data.data);
        toast.success(response.data.message);
        setDisplayForm((prev) => !prev);
        dispatch(setUserPlaylists([...userPlaylists, response.data.data]));
      }
    } catch (error) {
      console.log(error.status);
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        navigate(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  useEffect(() => {
    CheckIfVideoExistsinPlaylists();
  }, [videoId, userPlaylists]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div
        ref={wrapperRef}
        className="addToPlaylistButto w-[25%] flex flex-col gap-4 absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-2 items-center bg-black border rounded-lg text-white"
      >
        <div className="flex flex-row gap-4">
          <div className="label">
            <h2 className="text-lg font-bold text-center">
              Save to Playlist....
            </h2>
          </div>

          {displayForm && (
            <div onClick={() => setDisplayForm((prev) => !prev)}>
              <X className="text-lg text-white" />
            </div>
          )}
        </div>

        {userPlaylists.length === 0 && !displayForm && (
          <div className="text-center flex flex-col gap-2">
            <p>{successMessage}</p>
            <p onClick={() => setDisplayForm((prev) => !prev)}>
              Click here to create one..
            </p>
          </div>
        )}

        {displayForm ? (
          <div
            onClick={() => setDisplayForm((prev) => !prev)}
            className={`flex items-center justify-between text-white text-base  ${
              displayForm && "flex-col gap-4 rounded-lg p-2 w-full "
            }`}
          >
            <div className="flex ">
              <Pencil className="mr-2" />
              <p>Create New Playlist</p>
            </div>

            <form
              onSubmit={handleSubmit(createPlaylist)}
              onClick={(e) => e.stopPropagation()}
              className="w-full flex flex-col gap-4 p-2"
            >
              <FormInput
                placeholder="Enter name of your playlist"
                className="w-full p-2 border border-white "
                inputClassname="w-full"
                {...register("name", {
                  required: "name of the playlist is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm text-center">
                  {errors.name.message}
                </p>
              )}
              <FormInput
                placeholder="Enter description of playlist"
                className="w-full h-full p-2 border "
                inputClassname="w-full"
                {...register("description", {
                  required: "description of the playlist is required",
                })}
              />

              {errors.description && (
                <p className="text-red-500 text-sm text-center">
                  {errors.description.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg p-2 bg-blue-500 text-white"
              >
                Create
              </button>
            </form>
          </div>
        ) : (
          userPlaylists &&
          userPlaylists?.length !== 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                {userPlaylists.map((playlist) => (
                  <div key={playlist._id} className="flex flex-row gap-2">
                    <input
                      type="checkbox"
                      id={playlist._id}
                      checked={!!checkedPlaylists[playlist._id]}
                      onChange={(e) =>
                        addOrRemoveVideoFromPlaylist(playlist._id, e)
                      }
                    />
                    <label htmlFor={playlist._id}>{playlist.name}</label>
                  </div>
                ))}
              </div>
              <div
                className="flex "
                onClick={() => setDisplayForm((prev) => !prev)}
              >
                <Pencil className="mr-2" />
                <p>Create New Playlist</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AddToPlaylist;
