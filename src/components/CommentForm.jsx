import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormInput } from "./index.js";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "./ui/button.jsx";
import { toast } from "react-toastify";

function CommentForm({
  setComments,
  currentVideoId,
  setDisplayInput,
  comment,
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      content: comment?.content || "",
    },
  });

  const watchContent = watch("content", comment?.content || "");
  const [isdisabled, setDisabled] = useState(null);

  useEffect(() => {
    if (comment?.content) {
      setDisabled(watchContent.trim() === comment.content);
    } else {
      setDisabled(!watchContent.trim());
    }
  }, [comment, watchContent]);

  const submit = async (data) => {
    if (comment) {
      try {
        const response = await axios.patch(
          `/api/v1/comment/${comment._id}`,
          data
        );
        console.log("editComement Response: ", response.data.data);
        if (response.status === 200) {
          toast.success(response.data.message);
          setComments((prev) =>
            prev.map((prevComment) =>
              prevComment._id === comment._id ? response.data.data : prevComment
            )
          );
          setDisplayInput(null);
          reset({ content: "" });
        }
      } catch (error) {
        console.log(error.response?.message || error);
        toast.error(error.response?.message || "Failed to edit Comment");
      }
    } else {
      console.log("comment data: ", data);
      try {
        const response = await axios.post(
          `/api/v1/comment/${currentVideoId}`,
          data
        );
        if (response.status === 201) {
          console.log("addComement Response: ", response.data.data);
          toast.success(response.data.mesage);
          setComments((prev) => [response.data.data, ...prev]);
          setDisplayInput(false);
          reset({ content: "" });
        }
      } catch (error) {
        console.log(error.response?.message || error);
        toast.error(error.response?.message || "Failed to add Comment");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-full flex flex-col gap-2"
    >
      <div className="input w-full">
        <FormInput
          type="textarea"
          className="border-b border-white "
          placeholder="Write your comment"
          textareaClassName="text-base focus:outline-none p-2 w-full"
          {...register("content", { required: true })}
        />
      </div>

      <div className="buttons self-end flex flex-row gap-2">
        <Button
          onClick={() => {
            reset({ content: "" });
            setDisplayInput(comment ? null : false);
          }}
          className={"bg-red-500 rounded-4xl hover:bg-red-400 hover:text-black"}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isdisabled}
          className={
            isdisabled
              ? "bg-gray-500 rounded-4xl"
              : "bg-blue-500 rounded-4xl hover:bg-blue-400"
          }
        >
          Post
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
