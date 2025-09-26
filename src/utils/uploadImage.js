import axios from "axios";
import React, { useEffect, useState } from "react";

export default async function uploadImage(file, fileName) {
  const formData = new FormData();
  formData.append(`${fileName}`, file);

  await axios
    .patch("api/v1/users/uploadCoverImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("response: ", response.data.data.url);
      return response.data.data.url;
    })
    .catch((error) => {
      console.error(
        `Couldn't upload ${fileName} to the cloudinary : ${error.message}`
      );
    });
}
