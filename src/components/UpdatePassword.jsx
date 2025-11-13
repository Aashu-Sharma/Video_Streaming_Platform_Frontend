import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "./index.js";
import { Button } from "./ui/button.jsx";
import { useDispatch } from "react-redux";
import { updateUserPassword } from "../store/profileSlice.js";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

function UpdatePassword() {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const formValues = watch();
  const submit = async (data) => {
    console.log(data);
    const newData = {
      oldPassword: data.password,
      newPassword: data.newPassword,
    };
    setIsSubmitting(true);
    try {
      const res = await dispatch(updateUserPassword(newData)).unwrap();
      toast.success(`successfully updated password`);
      reset({
        password: "",
        newPassword: "",
      });
    } catch (error) {
      console.error(`Error updating password`, error);
      toast.error(error?.message || `Failed to update password`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (
      formValues.password.trim() !== "" &&
      formValues.newPassword.trim() !== ""
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formValues]);
  return (
    <form
      className="w-full flex flex-col gap-2"
      onSubmit={handleSubmit(submit)}
    >
      <div className="w-full h-[70px] ">
        <FormInput
          type={"password"}
          placeholder="Enter your old password"
          className={`w-full h-[70px] flex flex-row items-center gap-6 text-white`}
          inputClassname="border border-white w-full gap-2 rounded-lg p-3"
          {...register("password", {
            required: "Password is required",
          })}
        />
      </div>
      <div className="w-full h-[70px] ">
        <FormInput
          type={"password"}
          placeholder="Enter new password"
          className={`w-full h-[70px] flex flex-row items-center text-white`}
          inputClassname="border border-white w-full gap-2 rounded-lg p-3"
          {...register("newPassword", {
            required: "New Password is required",
          })}
        />
      </div>
      <Button
        disabled={disabled || isSubmitting}
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

export default UpdatePassword;
