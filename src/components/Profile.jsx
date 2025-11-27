import React from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { deviceWidth } from "../utils/index.js";

function Profile({ profileData, channelVideos, channelPosts, user, deletePost }) {
  const userData = useSelector((state) => state.auth.userData);
  const isUserProfile = profileData?._id === userData?._id;
  const isMobile = deviceWidth();

  return (
    <div className="w-full h-full flex flex-col">
      <div className={`upper-container w-full  ${isMobile ? "p-4 h-[150px]" : "p-8 h-[200px]"} flex flex-row items-center gap-8 border-b-2 border-gray-200 `}>
        <div
          className={`Profile-image-circle ${
            isMobile ? "w-16 h-16" : "w-30 h-30"
          } rounded-full border overflow-hidden `}
        >
          <img
            src={profileData?.avatar}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="Profile-details">
          <h1 className={`${
              isMobile ? "text-base mb-1" : "text-3xl font-bold mb-2"
            }  `}>
            {profileData?.username?.toUpperCase()}
          </h1>
          <p className="text-sm text-gray-200 mb-2">{`Total Subscribers: ${profileData?.subscribersCount}`}</p>
          <p className="text-sm text-gray-200">{`Total Videos: ${profileData?.videosCount}`}</p>
        </div>
      </div>
      <div className="lower-container w-full h-full flex flex-col">
        <div className="nav flex flex-row items-center justify-center border-b-2 w-full">
          <div className="Videos w-[50%] border-r-2 border-gray-200 text-center text-2xl p-2">
            {isUserProfile ? (
              <Link to={`/userProfile/videos`}>Videos</Link>
            ) : (
              <Link to={`/${user}/videos`}>Videos</Link>
            )}
          </div>
          <div className="Posts  w-[50%] text-center text-2xl p-2">
            {isUserProfile ? (
              <Link to={`/userProfile/posts`}>Posts</Link>
            ) : (
              <Link to={`/${user}/posts`}>Posts</Link>
            )}
          </div>
        </div>
        <Outlet context={{ channelVideos, channelPosts, profileData, deletePost }} />
      </div>
    </div>
  );
}

export default Profile;
