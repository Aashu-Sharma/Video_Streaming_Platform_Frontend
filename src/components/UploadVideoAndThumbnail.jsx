import React from "react";
import { GetImageOrVideoPreview } from "./index.js";
import { Plus } from "lucide-react";

function UploadVideoAndThumbnail({
  control,
  className,
  errors,
  setValue,
  clearErrors,
  thumbnail,
  videoFile,
}) {
  return (
    <div className={`flex flex-col w-[39%] gap-4 items-center ${className}`}>
      <GetImageOrVideoPreview
        control={control}
        name={"videoFile"}
        className={`w-full h-[300px] border rounded-lg relative overflow-hidden flex items-center `}
        videoClassName={`rounded-lg object-cover`}
        defaultValue={videoFile && videoFile}
        label={
          <div>
            <Plus className="mx-auto" size={40} />
            <p className="text-center">Upload Video</p>
          </div>
        }
        accept="video/*"
        rules={{
          validate: (file) => {
            if (!file) return "Video is required";
            if (file.size > maxFileSize)
              return `File size should be less than ${
                maxFileSize / (1024 * 1024)
              } MB`;
          },
        }}
        allowRemove={false}
        setValue={setValue}
        clearErrors={clearErrors}
      />
      {errors.videoFile && (
        <p className="text-red-500">{errors.videoFile.message}</p>
      )}

      <GetImageOrVideoPreview
        control={control}
        name={"thumbnail"}
        className={`w-full h-[300px] border rounded-lg relative overflow-hidden flex items-center`}
        imgClassName={`w-full h-full object-cover rounded-lg`}
        defaultValue={thumbnail && thumbnail}
        label={
          <div>
            <Plus className="mx-auto" size={40} />
            <p className="text-center">Upload Thumbnail</p>
          </div>
        }
        accept="image/*"
        rules={{
          required: "Thumbnail is required",
        }}
        setValue={setValue}
        clearErrors={clearErrors}
        allowRemove={true}
      />
      {errors.thumbnail && (
        <p className="text-red-500">{errors.thumbnail.message}</p>
      )}
    </div>
  );
}

export default UploadVideoAndThumbnail;
