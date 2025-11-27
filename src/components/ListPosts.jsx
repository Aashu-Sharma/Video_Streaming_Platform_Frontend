import React, { useEffect, useState } from "react";
import { Button } from "./ui/button.jsx";
import {
  ArrowLeft,
  ArrowRight,
  EllipsisVertical,
  ThumbsUp,
} from "lucide-react";
import { checkTimePassed } from "../utils/timeFormatter.js";
import { DropdownComp } from "./index.js";
import { useDispatch } from "react-redux";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";

function ListPosts({ postList, isUser, handleDelete }) {
  const [imageIndexes, setImageIndexes] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [postsLikes, setPostsLikes] = useState({});
  const dispatch = useDispatch();

  const setActiveIndex = (postId, index) => {
    setImageIndexes((prev) => ({ ...prev, [postId]: index }));
  };

  const getLikedPosts = async (tweetIds) => {
    if (!tweetIds || tweetIds.length === 0) {
      return;
    }
    console.log("postids in getLikedPosts: ", tweetIds);
    try {
      const response = await axios.post(`/api/v1/likes/tweets/liked`, {
        tweetIds,
      });
      if (response.status === 200) {
        console.log("Liked Posts: ", response.data.data);
        setLikedPosts((prev) => [...prev, ...response.data.data]);
      }
    } catch (error) {
      console.error("Error in getLikedPosts", error.response.data);
    }
  };

  const getPostsLikes = async (tweetIds) => {
    if (!tweetIds || tweetIds.length === 0) {
      return;
    }

    console.log("postids in getPostsLikes: ", tweetIds);
    try {
      const response = await axios.post(`/api/v1/likes/t/likesCount`, {
        tweetIds,
      });

      if (response.status === 200) {
        console.log("Posts Likes Count: ", response.data.data);
        setPostsLikes((prev) => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error("Error in getPostsLikes", error.response.data);
    }
  };

  const toggleTweetLike = async (tweetId) => {
    try {
      const response = await axios.post(`/api/v1/likes/toggle/t/${tweetId}`);
      if (response.status === 201) {
        // add postId to LikedPosts array
        setLikedPosts((prev) => [...prev, tweetId]);
      }
      if (response.status === 200) {
        // remove postId from LikedPosts array
        setLikedPosts((prev) => prev.filter((id) => id !== tweetId));
      }

      try {
        const res = await axios.post(`/api/v1/likes/t/likesCount/${tweetId}`);
        if (res.status === 200) {
          setPostsLikes((prev) => ({
            ...prev,
            [tweetId]: res.data.data,
          }));
        }
      } catch (error) {
        console.error(
          "error while finding likes on a single comment you just liked",
          error.response.data
        );
      }

      // update likes count for the post
    } catch (error) {
      console.error("Error in toggleTweetLike", error.response.data);
    }
  };

  console.log("ChannelPosts: ", postList);

  useEffect(() => {
    if (!postList || postList.length === 0) {
      console.log("No posts available: ", postList);
      return;
    }
    const postIds = postList?.map((post) => post._id);
    console.log("Post Ids: ", postIds);
    getLikedPosts(postIds);
    getPostsLikes(postIds);
  }, [postList]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {postList?.map((post) => {
        const activeIndex = imageIndexes[post._id] || 0;
        return (
          <div
            key={post._id}
            className="w-full flex flex-col gap-2 border rounded-lg p-4"
          >
            <div
              className={`post-header  w-full ${
                isUser ? "flex  justify-between items-center" : "start"
              }`}
            >
              <div className="userDetails flex flex-row gap-2 items-center">
                <div className="Profile-image-circle w-[40px] h-[40px] rounded-full border overflow-hidden ">
                  <img
                    src={post?.owner?.avatar}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="username text-lg ">
                  <p>{post?.owner?.username}</p>
                </div>
                <div className="createdAt ">
                  <p>{checkTimePassed(post?.createdAt)}</p>
                </div>
              </div>
              {isUser && (
                <DropdownComp
                  trigger={
                    <EllipsisVertical className="text-xl text-gray-500" />
                  }
                  items={[
                    {
                      label: "Edit",
                      className: "bg-gray-500 rounded-3xl text-center w-full",
                    },
                    {
                      label: "Delete",
                      onClick: () => {
                        handleDelete(post._id);
                      },
                      className: "bg-red-500 rounded-3xl text-center w-full",
                    },
                  ]}
                  menuClassName={`w-[100px]`}
                />
              )}
            </div>

            <div className="postContent flex flex-col gap-2">
              <div className="w-full textContent">
                <p className="text-lg">{post?.content}</p>
              </div>
              {post?.images && post?.images.length > 0 && (
                <div className="imgBox w-full flex flex-row items-center justify-center gap-2">
                  {activeIndex > 0 && post?.images[activeIndex - 1] && (
                    <Button
                      className={" text-white w-[50px] "}
                      onClick={(e) => {
                        e.preventDefault();
                        if (activeIndex > 0) {
                          setActiveIndex(post._id, activeIndex - 1);
                        }
                      }}
                    >
                      <ArrowLeft size={20} />
                    </Button>
                  )}
                  <div className="imageContent w-full max-h-[400px]  overflow-hidden rounded-lg">
                    <img
                      src={post?.images[activeIndex]}
                      alt="post-img"
                      className="w-full  object-cover rounded-lg"
                    />
                  </div>

                  {activeIndex < post?.images.length - 1 &&
                    post?.images[activeIndex + 1] && (
                      <Button
                        className={" text-white w-[50px] "}
                        onClick={(e) => {
                          e.preventDefault();
                          if (activeIndex < post?.images.length - 1) {
                            setActiveIndex(post._id, activeIndex + 1);
                          }
                        }}
                      >
                        <ArrowRight size={20} />
                      </Button>
                    )}
                </div>
              )}
            </div>

            <Button
              className={"w-[100px] bg-transparent border"}
              onClick={(e) => toggleTweetLike(post._id)}
            >
              {!likedPosts.includes(post._id) ? (
                <ThumbsUp size={20} />
              ) : (
                <ThumbUpIcon size={20} />
              )}

              <span className="ml-2">{postsLikes[post._id]}</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default ListPosts;
