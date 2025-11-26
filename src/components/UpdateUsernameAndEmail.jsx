import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "./index.js";
import { Button } from "./ui/button.jsx";
import { useDispatch } from "react-redux";
import { updateUserAccountDetails } from "../store/profileSlice.js";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

function UpdateUsernameAndEmail({ username, email }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      username: username ? username : "",
      email: email ? email : "",
    },
  });
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (data) => {
    const newData = {
      ...(data.username !== username && { username: data.username }),
      ...(data.email !== email && { email: data.email }),
    };
    setIsSubmitting(true);
    try {
      const res = await dispatch(updateUserAccountDetails(newData)).unwrap();
      toast.success(
        `Successfully updated the ${newData.email || newData.username}`
      );
    } catch (error) {
      toast.error(
        error?.message ||
          `Failed to update ${newData.username || newData.email}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (username || email) {
      reset({ username: username || "", email: email || "" });
    }
  }, [username, email, reset]);

  return (
    <form
      className="w-full flex flex-col gap-2"
      onSubmit={handleSubmit(submit)}
    >
      <div className="w-full h-[70px] ">
        <FormInput
          type={"text"}
          placeholder="Enter your username"
          className={`w-full h-[70px] flex flex-row items-center gap-4 text-white`}
          inputClassname="border border-white text-white w-full gap-2 rounded-lg p-3"
          {...register("username", {
            required: "username is required",
          })}
        />
      </div>
      <div className="w-full h-[70px] ">
        <FormInput
          type={"email"}
          placeholder="Enter your email"
          className={`w-full h-[70px] flex flex-row items-center gap-10 text-white`}
          inputClassname="border border-white text-white w-full gap-2 rounded-lg p-3"
          {...register("email", {
            required: "Email is required",
            validate: {
              matchPattern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address",
            },
          })}
        />
      </div>
      <Button
        disabled={!isDirty || isSubmitting}
        className={"w-full bg-blue-500 hover:bg-blue-600"}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update"
        )}
      </Button>
    </form>
  );
}

export default UpdateUsernameAndEmail;
