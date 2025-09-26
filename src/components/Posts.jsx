import React from 'react';
import {AddPost, ListPosts} from './index.js';
import { useSelector } from 'react-redux';

function Posts() {
  const userData = useSelector((state) => state.auth.userData);
  if(!userData) return <p>Loading......</p>;
  return (

    <div className='w-3/5 h-full flex flex-col gap-4 p-4 '>
      <AddPost userData={userData}/>
      {/* <ListPosts/> */}
    </div>
  )
}

export default Posts;