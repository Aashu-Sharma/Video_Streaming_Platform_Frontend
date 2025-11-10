import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link} from "react-router-dom";
import {
  WatchHistory,
  PlaylistsSection,
  LikedVideosSection,
} from "../components/index.js";
import { deviceWidth } from "../utils/index.js";

function Library() {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.auth.userData);
  const isMobile = deviceWidth();

  return (
    <div
      className={`library-page w-full min-h-screen flex flex-col gap-4 p-4 text-white`}
    >
      <div
        className={`userDetails w-full flex flex-row items-center ${
          isMobile ? " gap-4" : "gap-8"
        } p-4 border-b-2 border-gray-200 `}
      >
        <div
          className={`Profile-image-circle ${
            isMobile ? "w-16 h-16" : "w-20 h-20"
          }  rounded-full border overflow-hidden `}
        >
          <img
            src={profileData?.avatar}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="Profile-details">
          <h1
            className={`${
              isMobile ? "text-base mb-1" : "text-2xl font-bold mb-2"
            }  `}
          >
            {profileData?.username?.toUpperCase()}
          </h1>
          <Link to={`/userProfile`}>
            <p
              className={`${
                isMobile ? "text-xs mb-1" : "text-sm mb-2"
              }  text-gray-200 `}
            >
              View your channel
            </p>
          </Link>
        </div>
      </div>

      <div className="w-full h-full flex flex-col gap-6 ">
        <div className="w-full ">
          <WatchHistory />
        </div>

        <div className="w-full ">
          <PlaylistsSection />
        </div>

        <div className="w-full ">
          <LikedVideosSection />
        </div>
      </div>
    </div>
  );
}

export default Library;
