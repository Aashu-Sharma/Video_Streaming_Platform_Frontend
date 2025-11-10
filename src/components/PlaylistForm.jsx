import React from "react";
import { Pencil } from "lucide-react";
import { FormInput } from "./index.js";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createPlaylist, updatePlaylist } from "../store/playlistSlice.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PlaylistForm({ playlist, setDisplayForm }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: playlist?.name || "",
      description: playlist?.description || "",
    },
  });

  const playlistId = playlist ? playlist._id : null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (data) => {
    console.log("data: ", data);
    let rawData = {
      name: data.name,
      description: data.description,
    };
    if (playlist) {
      try {
        await dispatch(updatePlaylist({data: rawData, playlistId})).unwrap();
        toast.success("Playlist updated successfully");
        reset({
          name: "",
          description: "",
        }); 
        setDisplayForm((prev) => !prev)
      } catch (error) {
        console.error("Error updating playlist:", error);
        toast.error(error?.message || "Failed to update playlist");
      }
    } else {
      try {
        await dispatch(createPlaylist(rawData)).unwrap();
        toast.success("Playlist created successfully");
        reset({
          name: "",
          description: "",
        });
        setDisplayForm(prev => !prev)
        navigate(-1);
      } catch (error) {
        console.error("Error creating playlist:", error);
        toast.error(error?.message || "Failed to create playlist");
      }
    }
  };
  return (
    <div
      className={`flex  text-white text-base  
        items-center flex-col gap-4 rounded-lg p-2 w-full `}
    >
      <div className="flex ">
        <Pencil className="mr-2" />
        <p>{playlist ? "Update Playlist" : "Create New Playlist"}</p>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        onClick={(e) => e.stopPropagation()}
        className="w-full flex flex-col gap-6 p-2"
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
          {playlist ? "Submit": "Create"}
        </button>
      </form>
    </div>
  );
}

export default PlaylistForm;
