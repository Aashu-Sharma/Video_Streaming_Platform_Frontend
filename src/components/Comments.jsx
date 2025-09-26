import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "./AvatarComp.jsx";
import { CommentForm, ListComments } from "./index.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import deviceWidth from "../utils/deviceWidth.js";
import { checkTimePassed } from "../utils/timeFormatter.js";
import { X } from "lucide-react";

function Comments({
  currentVideoId,
  inMobileDisplayAllComments,
  setInMobileDisplayAllComments,
}) {
  const [comments, setComments] = useState([]);
  const [likedComments, setLikedComments] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayCommentCount, setDisplayCommentCount] = useState(0);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const isMobile = deviceWidth();
  // const [displayAllComments, setDisplayAllComments] = useState(false);

  const [displayInput, setDisplayInput] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});

  const lastCommentRef = useCallback(
    (node) => {
      if (loading) return;
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const getVideoComments = async (videoId, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`/api/v1/comment/${videoId}`, {
        params: { page, limit },
      });
      console.log("Response: ", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching video comments: ", error.response.data);
    }
  };

  const loadComments = async (videoId) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      const { comments: newComments, hasMore: more } = await getVideoComments(
        videoId,
        page
      );
      setComments((prev) => [...prev, ...newComments]);
      setHasMore(more);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
    setLoading(false);
  };

  const getTotalComments = async (videoId) => {
    try {
      const response = await axios.get(`/api/v1/comment/count/${videoId}`);
      console.log("TotalComments on the video; ", response.data.data);
      if (response.status === 200) {
        setDisplayCommentCount(response.data.data);
      }
    } catch (error) {
      console.log(error.response.data || error);
    }
  };

  const getLikedComments = async (commentIds) => {
    try {
      const response = await axios.post(`/api/v1/likes/comments/liked`, {
        commentIds,
      });
      if (response.status === 200) {
        console.log("LikedComments: ", response.data.data);
        setLikedComments((prev) => [...prev, ...response.data.data]);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const getCommentLikes = async (commentIds) => {
    try {
      const response = await axios.post(`/api/v1/likes/c/likesCount`, {
        commentIds,
      });
      if (response.status === 200) {
        setCommentLikes((prev) => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error(error.response.data || error);
    }
  };

  const addOrRemoveLikeFromComment = async (commentId) => {
    try {
      const response = await axios.post(`/api/v1/likes/toggle/c/${commentId}`);
      if (response.status === 201) {
        setLikedComments((prev) => [...prev, commentId]);
      } else if (response.status === 200) {
        setLikedComments((prev) => prev.filter((id) => id !== commentId));
      }

      try {
        const res = await axios.post(`/api/v1/likes/c/likesCount/${commentId}`);
        if (res.status === 200) {
          setCommentLikes((prev) => ({
            ...prev,
            [commentId]: res.data.data,
          }));
        }
      } catch (error) {
        console.error("Error response data: ", error.response.data);
      }
    } catch (error) {
      console.error("Error response data: ", error.response.data);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await axios.delete(`/api/v1/comment/${commentId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        setDisplayCommentCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (comments.length === 0) return;

    const unFetched = comments
      .map((comment) => comment._id)
      .filter((id) => !(id in commentLikes));

    console.log("Unfetched CommentIds: ", unFetched);

    if (unFetched.length === 0) return;

    getCommentLikes(unFetched);
    getLikedComments(unFetched);
    getTotalComments(currentVideoId);
  }, [comments, currentVideoId]);

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
  }, [currentVideoId]);

  useEffect(() => {
    loadComments(currentVideoId);
  }, [currentVideoId, page]);

  if (!comments) return <p>Loading...</p>;

  if (!isMobile || (isMobile && inMobileDisplayAllComments)) {
    return (
      <div className={`border p-2 flex flex-col gap-4`}>
        {displayCommentCount !== 0 && (
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-lg "> Comments {displayCommentCount} </h2>
            {isMobile && (
              <X
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setInMobileDisplayAllComments((prev) => !prev);
                }}
              />
            )}
          </div>
        )}
        <div className="addComment w-full flex flex-row gap-2 ">
          <div className="userAvatar">
            <Avatar
              image={userData?.avatar}
              imageFallback={userData?.username}
            />
          </div>
          {displayInput ? (
            <CommentForm
              setComments={setComments}
              setDisplayInput={setDisplayInput}
              currentVideoId={currentVideoId}
            />
          ) : (
            <div
              className="border-b border-white w-full text-base text-gray-500"
              onClick={() => setDisplayInput((prev) => !prev)}
            >
              <p>Write something here</p>
            </div>
          )}
        </div>
        {comments.length !== 0 ? (
          <ListComments
            comments={comments.length > 0 ? comments : []}
            handleDelete={handleDelete}
            lastCommentRef={lastCommentRef}
            likedComments={likedComments}
            commentLikes={commentLikes}
            addOrRemoveLikeFromComment={addOrRemoveLikeFromComment}
            setComments={setComments}
          />
        ) : (
          <p className="text-center">
            No comments on this video. Write something to start a discussion
          </p>
        )}

        {loading && <p className="text-center text-gray-500">Loading.....</p>}
        {!hasMore && (
          <p className="text-center text-gray-500">No more comments.</p>
        )}
      </div>
    );
  } else if (isMobile && !inMobileDisplayAllComments) {
    return (
      <div
        className={`border p-2 flex flex-col gap-2 w-full `}
        onClick={(e) => {
          e.stopPropagation();
          setInMobileDisplayAllComments((prev) => !prev);
        }}
      >
        {displayCommentCount !== 0 && (
          <h2 className="text-lg "> Comments {displayCommentCount} </h2>
        )}

        <div className="commentToDisplay w-full flex flex-row gap-2 items-center">
          <div className="user-avatar ">
            <Avatar
              image={comments[0]?.owner?.avatar}
              imageFallback={"user-avatar"}
            />
          </div>
          <div className="username&content flex flex-col ">
            <div className="flex flex-row gap-2">
              <h4>{comments[0]?.owner?.username}</h4>
              <p>{checkTimePassed(comments[0]?.createdAt)}</p>
            </div>
            <p>{comments[0]?.content}</p>
          </div>
        </div>
      </div>
    );
  } else {
  }
}

export default Comments;
