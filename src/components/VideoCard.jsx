import React, { useState } from "react";
import { deviceWidth, truncate } from "../utils/index.js";
import { DropdownComp } from "./index.js";
import { EllipsisVertical } from "lucide-react";

function VideoCard({
  elem,
  className,
  thumbnailOrVideoContainerClassName,
  showDescription,
  titleLength,
  textsize,
  imgClassName,
  videoClassName,
  variant = "",
  items = [],
}) {
  const isMobile = deviceWidth();
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  console.log("elem in VideoCard: ", elem);
  return (
    <div
      className={`w-full ${className} rounded-lg  overflow-hidden`}
      onMouseEnter={() => setHoveredVideoId(elem._id)}
      onMouseLeave={() => setHoveredVideoId(null)}
    >
      <div
        className={`thumbnailOrVideoContainer relative ${thumbnailOrVideoContainerClassName} aspect-video overflow-hidden `}
      >
        {(elem.isPublished && hoveredVideoId === elem._id )? (
          <video
            src={elem.videoFile}
            autoPlay
            loop
            muted
            className={`w-full h-full object-cover ${videoClassName} border`}
          />
        ) : (
          <img
            src={elem?.thumbnail}
            alt="thumbnail"
            className={`w-full h-full object-cover ${imgClassName} border ${!elem.isPublished && "opacity-[0.3]"}`}
          />
        )}
        {!elem.isPublished && (
          <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  text-white font-bold px-2 py-1 rounded">
            Private
          </span>
        )}
      </div>
      <div
        className={`lower-part w-full flex items-center justify-between p-2`}
      >
        <div className="flex flex-row gap-2 items-center">
          <div
            className={`Profile-image-circle ${
              isMobile ? "w-6 h-6" : "w-8 h-8"
            } rounded-full border overflow-hidden `}
          >
            <img
              src={elem.owner.avatar}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={`videoDetails flex flex-col gap-1 ${textsize} text-white  `}
          >
            <p className=" font-bold ">{truncate(elem.title, titleLength)}</p>
            <div>
              <span className=" mr-2">{elem.owner.username.toUpperCase()}</span>
              <span className=" text-gray-200">{elem.views} views</span>
            </div>
            {showDescription && (
              <p className={`text-gray-200`}>
                {truncate(elem.description, isMobile ? 20 : 100)}
              </p>
            )}
          </div>
        </div>
        {["watchHistory", "Playlists", "profileVideos"].includes(variant) && (
          <DropdownComp
            trigger={<EllipsisVertical size={30} color="white" />}
            items={items}
            menuClassName={"w-60"}
            
          />
        )}
      </div>
    </div>
  );
}

export default VideoCard;
