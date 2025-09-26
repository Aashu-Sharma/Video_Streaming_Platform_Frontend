import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DropdownComp, CommentForm } from "./index.js";
import { checkTimePassed } from "../utils/timeFormatter.js";
import { EllipsisVertical, ThumbsUp } from "lucide-react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Avatar from "./AvatarComp.jsx";

function ListComments({
  comments,
  handleDelete,
  lastCommentRef,
  likedComments,
  commentLikes,
  addOrRemoveLikeFromComment,
  setComments
}) {
  const userData = useSelector((state) => state.auth.userData);
  const [displayEditInput, setDisplayEditInput] = useState(null);
  return comments.map((comment, index) => {
    if (index === comments.length - 1) {
      return (
        <div
          key={comment._id}
          ref={lastCommentRef}
          className="flex flex-row gap-2 items-center"
        >
          <div className="user-avatar ">
            <Avatar
              image={comment.owner.avatar}
              imageFallback={"user-avatar"}
            />
          </div>

          {displayEditInput === comment._id ? (
            <CommentForm 
              comment={comment}
              setDisplayInput={setDisplayEditInput}
              setComments={setComments}
            />
          ) : (
            <div className="w-full flex flex-row items-center justify-between">
              <div className="username&content flex flex-col ">
                <div className="flex flex-row gap-2">
                  <h4>{comment.owner.username}</h4>
                  <p>{checkTimePassed(comment.createdAt)}</p>
                </div>
                <p>{comment.content}</p>
                <div className="flex items-center gap-2">
                  <div onClick={() => addOrRemoveLikeFromComment(comment._id)}>
                    {!likedComments.includes(comment._id) ? (
                      <ThumbsUp className="w-[15px] " />
                    ) : (
                      <ThumbUpIcon className="w-[15px]" />
                    )}
                  </div>
                  <span className="text-sm">{commentLikes[comment._id]}</span>
                </div>
              </div>
              {userData?._id === comment?.owner?._id && (
                <DropdownComp
                  trigger={
                    <EllipsisVertical className="text-xl text-gray-500" />
                  }
                  items={[
                    {
                      label: "Edit",
                      onClick: () => setDisplayEditInput(comment._id),
                      className: "bg-gray-500 rounded-3xl text-center w-full",
                    },
                    {
                      label: "Delete",
                      onClick: () => {
                        handleDelete(comment._id);
                      },
                      className: "bg-red-500 rounded-3xl text-center w-full",
                    },
                  ]}
                  menuClassName={`w-[100px]`}
                />
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div key={comment._id} className="flex flex-row gap-2 items-center">
          <div className="user-avatar ">
            <Avatar
              image={comment.owner.avatar}
              imageFallback={"user-avatar"}
            />
          </div>

          {displayEditInput === comment._id ? (
            <CommentForm 
              comment={comment}
              setDisplayInput={setDisplayEditInput}
              setComments={setComments}

            />
          ) : (
            <div className="w-full flex flex-row items-center justify-between">
              <div className="username&content flex flex-col ">
                <div className="flex flex-row gap-2">
                  <h4>{comment.owner.username}</h4>
                  <p>{checkTimePassed(comment.createdAt)}</p>
                </div>
                <p>{comment.content}</p>
                <div className="flex items-center gap-2">
                  <div onClick={() => addOrRemoveLikeFromComment(comment._id)}>
                    {!likedComments.includes(comment._id) ? (
                      <ThumbsUp className="w-[15px] " />
                    ) : (
                      <ThumbUpIcon className="w-[15px]" />
                    )}
                  </div>
                  <span className="text-sm">{commentLikes[comment._id]}</span>
                </div>
              </div>
              {userData?._id === comment?.owner?._id && (
                <DropdownComp
                  trigger={
                    <EllipsisVertical className="text-xl text-gray-500" />
                  }
                  items={[
                    {
                      label: "Edit",
                      onClick: () => setDisplayEditInput(comment._id),
                      className: "bg-gray-500 rounded-3xl text-center w-full",
                    },
                    {
                      label: "Delete",
                      onClick: () => {
                        handleDelete(comment._id);
                      },
                      className: "bg-red-500 rounded-3xl text-center w-full",
                    },
                  ]}
                  menuClassName={`w-[100px]`}
                />
              )}
            </div>
          )}
        </div>
      );
    }
  });
}

export default ListComments;
