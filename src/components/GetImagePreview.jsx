import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

function GetImageOrVideoPreview({
  label,
  control,
  className,
  name,
  defaultValue = "",
  imgClassName,
  videoClassName,
  accept = "image/*",
  rules = { required: name + "is required" },
  setValue,
  clearErrors,
  removeClassName,
}) {
  const [preview, setPreview] = useState(defaultValue || "");
  const handleRemove = () => {
    setPreview("");
    setValue(name, null)
    clearErrors(name);
  };

  const handlePreview = (event) => {
    console.log("function ran");
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      return file;
    }
  };

  useEffect(() => {
    if(defaultValue ){
      setPreview(defaultValue)
    }
  }, [defaultValue])

  return (
    <div className={`${className} `}>
      {preview.trim() !== "" ? (
        name === "videoFile" ? (
          <>
            <video
              controls
              src={preview}
              className={`w-full h-full ${videoClassName}`}
              type="video/mp4"
            />
            <button onClick={() => handleRemove()}>
              <X className="z-[2] absolute top-0 right-0 text-red-500" />
            </button>
          </>
        ) : (
          <>
            <img src={preview} className={` ${imgClassName}`} />
            <button onClick={() => handleRemove()}>
              <X
                className={`z-[2] absolute top-0 right-0 text-red-500 ${removeClassName}`}
              />
            </button>
          </>
        )
      ) : (
        <>
          <label
            htmlFor={name}
            className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          >
            {label}
          </label>

          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ""}
            render={({ field: { onChange } }) => (
              <input
                type="file"
                id={name}
                accept={accept}
                className="hidden "
                onChange={(e) => {
                  onChange(handlePreview(e));
                }}
              />
            )}
            rules={rules}
          />
        </>
      )}
    </div>
  );
}

export default GetImageOrVideoPreview;
