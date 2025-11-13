import {
  UpdateCoverImageAndAvatar,
  UpdatePassword,
  UpdateUsernameAndEmail,
} from "../components/index.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deviceWidth } from "../utils/index.js";
import React from "react";
import { useSelector } from "react-redux";

function Settings() {
  const isMobile = deviceWidth();
  const userData = useSelector((state) => state.profile.profileData);
  return (
    <div
      className={`w-full min-h-screen flex ${
        isMobile ? "flex-col gap-6" : "flex-row gap-4"
      } p-4`}
    >
      <div
        className={` ${
          isMobile
            ? "w-full flex flex-row items-center gap-2"
            : "w-1/3 flex flex-col justify-center items-center gap-4"
        } `}
      >
        <Avatar className={isMobile ? "w-20 h-20" : "w-40 h-40"}>
          <AvatarImage src={userData?.avatar} alt={userData?.username} />
          <AvatarFallback>{userData?.username}</AvatarFallback>
        </Avatar>
        <div
          className={`userDetails 
          ${
            isMobile ? "w-80 " : "w-full"
          } flex flex-col gap-2 items-center text-white`}
        >
          <h1
            className={`${
              isMobile ? "text-lg" : "text-4xl"
            }  text-white font-bold`}
          >
            {userData?.username?.toUpperCase()}
          </h1>
          <p>email: {userData?.email}</p>
          <p>name: {userData?.fullName}</p>
          <p></p>
        </div>
      </div>
      <hr />
      <div className="w-full text-white flex flex-col gap-8">
        <div className="updateCoverImageAndAvatar w-full flex flex-col gap-2 ">
          <h3 className="text-3xl font-bold">Update CoverImage and Avatar</h3>
          <UpdateCoverImageAndAvatar
            coverImage={userData?.coverImage}
            avatar={userData?.avatar}
            userData={userData}
          />
        </div>
        <hr />
        <div className="updateUsernameAndEmail w-full flex flex-col gap-2">
          <h3 className="text-3xl font-bold">Update Username and email</h3>
          <UpdateUsernameAndEmail
            username={userData?.username}
            email={userData?.email}
          />
        </div>
        <hr />
        <div className="UpdatePassword w-full flex flex-col gap-2">
          <h3 className="text-3xl font-bold">Update Your Password</h3>
          <UpdatePassword/>
        </div>
      </div>
    </div>
  );
}

export default Settings;
