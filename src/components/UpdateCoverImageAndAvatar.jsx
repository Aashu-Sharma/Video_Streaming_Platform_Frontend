import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GetImageOrVideoPreview } from "./index.js";
import deviceWidth from "../utils/deviceWidth.js";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { useDispatch } from "react-redux";
import {
  updateUserAvatar,
  updateUserCoverImage,
} from "../store/profileSlice.js";
import { toast } from "react-toastify";

function UpdateCoverImageAndAvatar({ coverImage, avatar }) {
  const dispatch = useDispatch();
  const isMobile = deviceWidth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      coverImage: coverImage || "",
      avatar: avatar || "",
    },
  });

  const submit = async (data) => {
    const imageUpdates = [
      {
        key: "coverImage",
        action: updateUserCoverImage,
        label: "coverImage",
      },
      {
        key: "avatar",
        action: updateUserAvatar,
        label: "avatar",
      },
    ];

    const toUpdate = imageUpdates.filter(
      ({ key }) => typeof data[key] !== "string"
    );

    if (toUpdate.length === 0) {
      return;
    }
    

    setIsSubmitting(true);

    try {
      const results = await Promise.allSettled(
        toUpdate.map(async ({ key, action, label }) => {
          const imageData = new FormData();
          imageData.append(key, data[key]);
          await dispatch(action(imageData)).unwrap();
          return label;
        })
      );

      const successfull = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");

      if (successfull.length > 0) {
        const labels = successfull.map((r) => r.value).join(" and ");
        toast.success(`Successfully updated ${labels}`);
      }

      if (rejected.length > 0) {
        rejected.forEach((result, index) => {
          const label = toUpdate[index].label;
          toast.error(result.reason?.message || `failed to update ${label}`);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (coverImage && avatar) {
      reset({ coverImage: coverImage || "", avatar: avatar || "" });
    }
  }, [coverImage, avatar, reset]);

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={handleSubmit(submit)}
    >
      <div
        className={`coverImage border rounded-lg w-full ${
          isMobile ? "h-[200px]" : "h-[300px]"
        } relative `}
      >
        <GetImageOrVideoPreview
          name={"coverImage"}
          control={control}
          className={
            "w-full h-full text-white bg-transparent overflow-hidden flex items-center"
          }
          imgClassName={"rounded-lg w-full h-full object-cover"}
          label={<Plus className="text-white w-[30px] h-[30px]" />}
          defaultValue={coverImage}
          setValue={setValue}
        />

        <div className="avatar w-40 h-40 rounded-full border absolute bottom-0 left-0">
          <GetImageOrVideoPreview
            name={"avatar"}
            control={control}
            className={
              "w-full h-full bg-black rounded-full overflow-hidden text-white relative"
            }
            imgClassName={"w-full h-full "}
            label={<Plus className="text-white w-[30px] h-[30px]" />}
            removeClassName={"top-[15px] right-[15px]"}
            defaultValue={avatar}
            setValue={setValue}
          />
        </div>
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

export default UpdateCoverImageAndAvatar;
