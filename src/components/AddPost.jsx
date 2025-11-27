import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormInput } from "./index.js";
import { Button } from "./ui/button.jsx";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUserPosts } from "../store/authSlice.js";
import axios from "axios";
import { toast } from "react-toastify";

// todo : add validation for images and content
// todo: instant ui update after post creation

function AddPost({ userData, userPosts }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      content: "",
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "images",
    control,
    rules: {
      maxLength: 3,
    },
  });
  // const [displayImageForm, setDisplayImageForm] = useState(false);
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState({});
  const [disabled, setDisabled] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const prevField = fields[activeIndex - 1];
  const nextField = fields[activeIndex + 1];

  const watchContent = watch("content");

  useEffect(() => {
    setDisabled(!watchContent?.trim());
  }, [watchContent]);

  const handleOnChange = (event, id) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        setImagePreview((prev) => ({ ...prev, [id]: fileUrl }));
      }
    }
  };

  const handleRemove = async (index) => {
    setActiveIndex((prev) => (prev === 0 ? 0 : prev - 1));
    remove(index);
  };

  const submit = async (data) => {
    console.log("FormData: ", data);
    console.log("type of images data: ", typeof data.images);
    const postData = new FormData();
    postData.append("content", data.content);
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        const fileList = data.images[i];
        if (fileList && fileList[0]) postData.append("images", fileList[0]);
      }
    }
    postData.forEach((value, key) => {
      console.log(key, ": ", value);
    });
    try {
      const response = await axios.post(`/api/v1/tweets/create`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        console.log("Post created successfully: ", response.data.data);
        toast.success("Post created successfully!");
        setValue("content", "");
        setValue("images", []);
        setImagePreview({});
        setActiveIndex(null);
        userPosts = [response.data.data, ...userPosts];
        dispatch(setUserPosts(userPosts));
      }
    } catch (error) {
      console.error(error.response.data);
      console.log("Error message: ", error.response.data.message);
    }
  };

  useEffect(() => {
    if (fields.length === 0) {
      setImagePreview({});
      setActiveIndex(null);
    }
  }, [fields]);

  return (
    <div className="w-full flex flex-col gap-2 border rounded-lg p-4 ">
      <div className="userDetails flex flex-row gap-2 items-center">
        <div className="Profile-image-circle w-[40px] h-[40px] rounded-full border overflow-hidden ">
          <img src={userData?.avatar} className="w-full h-full object-cover" />
        </div>
        <div className="text-lg ">
          <p>{userData?.username}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="w-full flex flex-col gap-2"
      >
        <div className="post-form w-full flex flex-col gap-2">
          <FormInput
            type="textarea"
            rows={2}
            className="w-full "
            textareaClassName="w-full border rounded p-2"
            {...register("content", { required: "Content is required" })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm text-center">
              {errors.content.message}
            </p>
          )}

          {fields.length > 0 && (
            <div className="w-full flex flex-row gap-2 items-center">
              {prevField && (
                <Button
                  className={" text-white w-[50px] "}
                  onClick={(e) => {
                    e.preventDefault();
                    if (activeIndex > 0) {
                      setActiveIndex((prev) => prev - 1);
                    }
                  }}
                >
                  <ArrowLeft size={20} />
                </Button>
              )}
              {fields[activeIndex] && imagePreview[fields[activeIndex]?.id] ? (
                <div className="w-full h-[300px] border rounded-lg overflow-hidden relative cursor-pointer">
                  <img
                    src={imagePreview[fields[activeIndex]?.id]}
                    className="w-full h-full object-cover"
                  />
                  <X
                    className="absolute top-[10px] right-[10px] bg-red-500"
                    color="white"
                    size={20}
                    onClick={() => handleRemove(activeIndex)}
                  />
                </div>
              ) : (
                <div className="w-full bg-transparent border rounded-lg relative h-[300px]">
                  <label
                    className=" absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                    htmlFor={fields[activeIndex]?.id}
                  >
                    <Plus size={30} />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id={fields[activeIndex]?.id}
                    className="hidden"
                    {...register(`images.${activeIndex}`, {
                      onChange: (e) => {
                        handleOnChange(e, fields[activeIndex]?.id);
                      },
                    })}
                  />
                  <X
                    className="absolute top-[10px] right-[10px] bg-red-500"
                    color="white"
                    size={20}
                    onClick={() => handleRemove(activeIndex)}
                  />
                </div>
              )}

              {nextField ? (
                <Button
                  className={" text-white w-[50px] "}
                  onClick={(e) => {
                    e.preventDefault();
                    if (activeIndex < fields.length - 1) {
                      setActiveIndex((prev) => prev + 1);
                    }
                  }}
                >
                  <ArrowRight size={20} />
                </Button>
              ) : (
                fields.length < 3 && (
                  <Button
                    className={" text-white w-[50px] "}
                    onClick={(e) => {
                      e.preventDefault();
                      if (fields.length < 3) {
                        append({});
                        setActiveIndex((prev) => prev + 1);
                      }
                    }}
                  >
                    <Plus size={20} />
                  </Button>
                )
              )}
            </div>
          )}

          {fields.length === 0 && (
            <Button
              className={" text-white w-[100px] "}
              onClick={(e) => {
                e.preventDefault();
                if (fields.length < 3) {
                  console.log("field state before append: ", fields);
                  append({});
                  setActiveIndex(0);
                  console.log("Fields after append: ", fields);
                }
              }}
            >
              Add Image
            </Button>
          )}
        </div>
        <Button type="submit" className={"bg-blue-500 text-white w-[100px]  "}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default AddPost;
