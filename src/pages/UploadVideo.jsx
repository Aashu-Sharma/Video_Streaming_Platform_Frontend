import React, { useState } from "react";
import deviceWidth from "../utils/deviceWidth.js";
import { useForm } from "react-hook-form";
import { UploadVideoAndThumbnail, FormInput } from "../components/index.js";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadVideo() {
  const isMobile = deviceWidth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue, 
    clearErrors
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (data) => {
    console.log(data);
    const videoData = new FormData();
    videoData.append("title", data.title);
    videoData.append("description", data.description);
    videoData.append("isPublished", JSON.parse(data.isPublished));
    videoData.append("videoFile", data.videoFile);
    videoData.append("thumbnail", data.thumbnail);

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/v1/videos/createVideo`,
        videoData
      );
      if (response.status === 201) {
        setLoading(false);
        toast.success(response.data.message);
        console.log("Video Data: ", response.data.data);
        navigate(-1);
      }
    } catch (error) {
      setLoading(false);
      console.error(
        error.response.data || "An errror occured while uploading video"
      );
      toast.error(
        error.response.data.message || "An errror occured while uploading video"
      );
    }
  };

  return (
    <div className={`bg-black w-full min-h-screen text-white`}>
      <div className={`w-full text-center border-b p-4`}>
        <h1 className={`text-2xl font-bold`}>Upload Video</h1>
      </div>

      <form onSubmit={handleSubmit(submit)} className="w-full flex flex-col ">
        <div className={`w-full h-full p-4 flex flex-col gap-4`}>
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
                {...register("isPublished")}
                className="w-full border bg-black text-white rounded-lg p-2  "
              >
                <option value={true}>Public</option>
                <option value={false}>Private</option>
              </select>
            </div>
            <UploadVideoAndThumbnail
              control={control}
              className={isMobile && "w-full"}
              errors={errors}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          </div>

          <Button type="submit" variant="contained" className="w-full my-4">
            Upload Video
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadVideo;
