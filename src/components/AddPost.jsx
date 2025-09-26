import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormInput } from "./index.js";
import { Button } from "./ui/button.jsx";
import { Plus, X } from "lucide-react";

function AddPost({ userData }) {
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
  const [displayImageForm, setDisplayImageForm] = useState(false);
  const [imagePreview, setImagePreview] = useState({});
  const [disabled, setDisabled] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

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
    setActiveIndex((prev) => prev === 0 ? 0 : prev - 1);
    remove(index);
    console.log("Removed index: ", index);
    console.log("Field state After Removed : ", fields);
  }

  const submit = async (data) => {
    console.log("FormData: ", data);
  };

  useEffect(() => {
    if (fields.length === 0) {
      setDisplayImageForm(false);
      setImagePreview({});
      setActiveIndex(null);
    }
    console.log("Fields state: ", fields);
    console.log("Current Active Index: ", activeIndex);
  }, [fields])

  console.log("fields: ", fields);

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

          {displayImageForm && (
            <div className="w-full flex flex-row gap-2 items-center">
              {/* {fields.map(
                (field, index) =>
                  imagePreview[field.id] ? (
                    <div
                      key={field.id}
                      className="w-full h-[300px] border rounded-lg overflow-hidden relative cursor-pointer"
                    >
                      <img
                        src={imagePreview[field.id]}
                        className="w-full h-full object-cover"
                      />
                      <X
                        className="absolute top-[10px] right-[10px] bg-red-500"
                        color="white"
                        size={20}
                        onClick={() => remove(index)}
                      />
                    </div>
                  ) : (
                    <div
                      key={field.id}
                      className="w-full bg-transparent border rounded-lg relative h-[300px]"
                    >
                      <label
                        className=" absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                        htmlFor={field.id}
                      >
                        <Plus size={30} />
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id={field.id}
                        className="hidden"
                        {...register(`images.${index}`, {
                          onChange: (e) => {
                            handleOnChange(e, field.id);
                          },
                        })}
                      />
                      <X
                        className="absolute top-[10px] right-[10px] bg-red-500"
                        color="white"
                        size={20}
                        onClick={() => remove(index)}
                      />
                    </div>
                  )
              )} */}

              {
                fields[activeIndex] && imagePreview[fields[activeIndex]?.id] ? (
                  <div
                      className="w-full h-[300px] border rounded-lg overflow-hidden relative cursor-pointer"
                    >
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
                ):(
                  <div
                      className="w-full bg-transparent border rounded-lg relative h-[300px]"
                    >
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
                )
              }
              
              {
                fields.length < 3 && displayImageForm &&(
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
              }
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
                setDisplayImageForm(true);
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
