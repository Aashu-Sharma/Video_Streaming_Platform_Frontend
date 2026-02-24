import React, { useState, useEffect } from "react";
import deviceWidth from "../utils/deviceWidth.js";
import { useForm } from "react-hook-form";
import { UploadVideoAndThumbnail, FormInput, TagsComp } from "./index.js";
import { Button } from "./ui/button.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  createVideo,
  fetchAllVideos,
  updateVideo,
} from "@/store/videoSlice.js";

function VideoForm({ video }) { 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = deviceWidth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      title: video ? video.title : "",
      description: video ? video.description : "",
      isPublished: video ? video.isPublished : true,
      videoFile: video ? video.videoFile : "",
      thumbnail: video ? video.thumbnail : "",
      tags: video && video.tags ? new Set([...video.tags]) : new Set(),
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (data) => {
    setIsSubmitting(true);
    if (video) {
      const videoId = video._id;
      const updatedData = new FormData();

      if (typeof data.thumbnail !== "string") {
        updatedData.append("thumbnail", data.thumbnail);
      }

      if (data.title !== video.title) {
        updatedData.append("title", data.title);
      }

      if (data.description !== video.description) {
        updatedData.append("description", data.description);
      }

      if (data.isPublished !== video.isPublished) {
        updatedData.append("isPublished", JSON.parse(data.isPublished));
      }

      if (data.tags !== video.tags){
        updatedData.append("tags",  data.tags ? data.tags.join(", ") : "");
      }

      const isEmpty = [...updatedData.keys()].length === 0;

      if (isEmpty) {
        toast.error("No updates to make");
      } else {
        try {
          await dispatch(updateVideo({ videoId, updatedData })).unwrap();
          toast.success("Successfully updated the video");
          await dispatch(fetchAllVideos()).unwrap();
          navigate("/");
        } catch (error) {
          toast.error(error?.message || "Failed to update video");
        }
      }
    } else {
      const videoData = new FormData();
      videoData.append("title", data.title);
      videoData.append("description", data.description);
      videoData.append("isPublished", JSON.parse(data.isPublished));
      videoData.append("videoFile", data.videoFile);
      videoData.append("thumbnail", data.thumbnail);
      videoData.append("tags", data.tags ? data.tags.join(", ") : "");
 
      try {
        await dispatch(createVideo(videoData)).unwrap();
        toast.success("Successfully published the video");
        await dispatch(fetchAllVideos()).unwrap();
        navigate("/");
      } catch (error) {
        toast.error(error?.message || "Failed to create video");
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (video) {
      reset({
        title: video.title || "",
        thumbnail: video.thumbnail || "",
        description: video.description || "",
        isPublished: video.isPublished,
        videoFile: video.videoFile || "",
        tags: video.tags || []
      });
    }
  }, [video, reset]);
  
  return (
    <div className={`bg-black w-full min-h-screen text-white`}>
      <div className={`w-full text-center border-b p-4`}>
        <h1 className={`text-2xl font-bold`}>
          {video ? "Update video details" : "Upload Video"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="w-full  h-full p-4 flex flex-col gap-4 "
      >
        <div
          className={`w-full h-full flex  ${
            isMobile ? "flex-col-reverse gap-4" : "justify-between gap-4"
          }`}
        >
          <div
            className={`${
              isMobile ? "w-full" : "w-[60%]"
            }  flex flex-col gap-4  `}
          >
            <FormInput
              label="Title"
              labelClassname="text-2xl font-bold"
              placeholder="Add Title Here...."
              className="text-base text-gray-200 "
              inputClassname="w-full border rounded-lg p-4 my-2 "
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}

            <FormInput
              type="textarea"
              label="Description"
              labelClassname="text-2xl font-bold"
              placeholder="Add Description Here...."
              className="text-base text-gray-200 "
              textareaClassName="w-full border rounded-lg p-4 my-2 h-[442px] resize-none"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}

            <select
              {...register("isPublished", {
                required: true,
              })}
              className="w-full border bg-black text-white rounded-lg p-2  "
            >
              <option value={"true"}>Public</option>
              <option value={"false"}>Private</option>
            </select>

            <TagsComp control={control} name="tags" maxTags={6} videoTags = {video?.tags}/>
          </div>
          <UploadVideoAndThumbnail
            control={control}
            className={isMobile && "w-full"}
            errors={errors}
            setValue={setValue}
            clearErrors={clearErrors}
            thumbnail={video?.thumbnail ? video.thumbnail : null}
            videoFile={video?.videoFile ? video.videoFile : null}
          />
        </div>

        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="w-full my-4 bg-blue-500 hover:bg-blue-600 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : video ? (
            "Update"
          ) : (
            "Upload"
          )}
        </Button>
      </form>
    </div>
  );
}

export default VideoForm;


