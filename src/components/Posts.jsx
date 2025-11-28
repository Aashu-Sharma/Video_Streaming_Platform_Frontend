import React from "react";
import { AddPost, ListPosts } from "./index.js";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { deviceWidth } from "../utils/index.js";

function Posts() {
  const { channelPosts, profileData, deletePost } = useOutletContext();
  const userData = useSelector((state) => state.auth.userData);
  const isUser = profileData?._id === userData?._id;
  const isMobile = deviceWidth();

  return (
    <div
      className={` ${
        isMobile ? "w-full " : "w-3/5"
      } h-full flex flex-col gap-4 p-4 `}
    >
      {isUser && <AddPost userData={profileData} userPosts={channelPosts} />}
      {channelPosts.length === 0 ? (
        <p
          className={` ${
            isMobile ? "text-lg" : "text-4xl "
          }  text-white `}
        >
          {isUser
            ? "You have no posts yet. Create your first post!"
            : "This user has no posts yet."}
        </p>
      ) : (
        <ListPosts
          postList={channelPosts}
          isUser={isUser}
          handleDelete={deletePost}
        />
      )}
    </div>
  );
}

export default Posts;
