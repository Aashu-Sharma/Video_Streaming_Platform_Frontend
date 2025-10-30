import React from 'react';
import {AddPost, ListPosts} from './index.js';
import { useOutletContext } from "react-router-dom";
import { useSelector } from 'react-redux';

function Posts() {
  const {channelPosts, profileData} = useOutletContext();
  const userData = useSelector((state) => state.auth.userData);
  const isUser = profileData?._id === userData?._id;
  if(!profileData) return <p>Loading......</p>;
  return (

    <div className='w-3/5 h-full flex flex-col gap-4 p-4 '>
      
      {isUser && (
        <AddPost userData={profileData} userPosts={channelPosts}/>
      )}
      <ListPosts postList = {channelPosts} isUser={isUser}/>
    </div>
  )
}

export default Posts;