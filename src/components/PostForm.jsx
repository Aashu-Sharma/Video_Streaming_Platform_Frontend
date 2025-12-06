import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormInput } from "./index.js";
import { Button } from "./ui/button.jsx";
import { ArrowLeft, ArrowRight, Plus, X, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createPost, updatePost } from "../store/postSlice.js";
import axios from "axios";

function PostForm({ userData, post, displayForm }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      content: post ? post.content : "",
      images: post && post.images.length !== 0 ? [...post.images] : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "images",
    control,
    rules: {
      maxLength: 3,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialPostRef = useRef(null);
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const prevField = fields[activeIndex - 1];
  const nextField = fields[activeIndex + 1];
  const formValues = watch();

  const handleOnChange = (event, id) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        setImagePreview((prev) => ({ ...prev, [id]: fileUrl }));
      }
    }
  };

  const handleRemove = async (index, imageUrl) => {
    if (post && post?.images.includes(imageUrl)) {
      const tweetId = post._id;
      const images = initialPostRef.current.images;
      try {
        await axios.delete(`/api/v1/tweets/${tweetId}/${index}`);
        let updatedImages = images.filter((image) => image !== imageUrl);
        initialPostRef.current.images = updatedImages;
      } catch (error) {
        console.log(error);
        console.log(error.response.data.message);
      }
    }
    setActiveIndex((prev) => (prev === 0 ? 0 : prev - 1));
    remove(index);
  };

  const submit = async (data) => {
    setIsSubmitting(true);
    if (post) {
      const tweetId = post._id;
      const updatedData = new FormData();

      if (data.content !== initialPostRef.current.content) {
        updatedData.append("content", data.content);
      }

      if (data.images && data.images.length > 0) {
        console.log("inside if");
        for (let i = 0; i < data.images.length; i++) {
          if (typeof data.images[i] !== "string") {
            updatedData.append("images", data.images[i][0]);
          }
        }
      }

      try {
        await dispatch(updatePost({ tweetId, updatedData })).unwrap();
        toast.success("Post updated successfully!");
        setValue("content", "");
        setValue("images", []);
        setImagePreview({});
        setActiveIndex(null);
        displayForm(null);
      } catch (error) {
        toast.error(error.message);
        console.error(error.message);
        console.log("Error message: ", error.message);
      }
    } else {
      const postData = new FormData();
      postData.append("content", data.content);
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          const fileList = data.images[i];
          if (fileList && fileList[0]) postData.append("images", fileList[0]);
        }
      }
      try {
        await dispatch(createPost(postData)).unwrap();
        toast.success("Post created successfully!");
        setValue("content", "");
        setValue("images", []);
        setImagePreview({});
        setActiveIndex(null);
      } catch (error) {
        console.error(error.response.data);
        console.log("Error message: ", error.response.data.message);
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (post) {
      initialPostRef.current = {
        content: post.content,
        images: [...post.images],
      };
    }
  }, [post]);

  useEffect(() => {
    if (post) {
      reset({ content: post.content || "", images: [] });
      if (post.images.length > 0) {
        post.images.forEach(() => append({}));
        setActiveIndex(0);
      }
    }
  }, [post, reset]);

  useEffect(() => {
    const inital = initialPostRef.current;
    if (
      fields.length !== 0 &&
      inital?.images.length > 0 &&
      fields.length === inital.images.length
    ) {
      const map = {};
      fields.forEach((field, index) => {
        map[field.id] = inital.images[index];
      });
      setImagePreview(map);
    }
  }, [fields]);

  useEffect(() => {
    if (fields.length === 0) {
      setImagePreview({});
      setActiveIndex(null);
    }
  }, [fields]);

  const isFormChanged = useMemo(() => {
    if (!post) return formValues.content !== "";
    const initial = initialPostRef?.current;

    if (!initial) return false;

    if (formValues.content.trim() !== initial.content.trim()) return true;

    const initialCount = initial.images.length;
    const currentCount = Object.keys(imagePreview).length;

    if (initialCount !== currentCount) return true;

    const initialList = initial.images;
    const currentList = Object.values(imagePreview);

    for (let i = 0; i < initialList.length; i++) {
      if (initialList[i] !== currentList[i]) return true;
    }

    const originalImages = post.images;
    if (originalImages.length !== initialCount) return true;

    for (let i = 0; i < originalImages.length; i++) {
      if (originalImages[i] !== initialList[i]) return true;
    }

    return false;
  }, [post, formValues, imagePreview, initialPostRef]);

  const disabled = !isFormChanged;

  console.log("imagePreview: ", imagePreview);

  return (
    <div className="w-full flex flex-col gap-2 border rounded-lg p-4 ">
      {!post && (
        <div className="userDetails flex flex-row gap-2 items-center">
          <div className="Profile-image-circle w-10 h-10 rounded-full border overflow-hidden ">
            <img
              src={userData?.avatar}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-lg ">
            <p>{userData?.username}</p>
          </div>
        </div>
      )}

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
                <div className="w-full h-128 border rounded-lg overflow-hidden relative cursor-pointer">
                  <img
                    src={imagePreview[fields[activeIndex]?.id]}
                    className="w-full h-full object-cover"
                  />
                  <X
                    className="absolute top-[10px] right-[10px] bg-red-500"
                    color="white"
                    size={20}
                    onClick={() =>
                      handleRemove(
                        activeIndex,
                        imagePreview[fields[activeIndex]?.id]
                      )
                    }
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
        <Button
          disabled={disabled || isSubmitting}
          type="submit"
          className={"bg-blue-500 text-white w-[100px]  "}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
}

export default PostForm;
