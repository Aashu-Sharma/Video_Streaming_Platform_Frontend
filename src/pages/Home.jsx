import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {ListVideos} from '../components/index.js';
import deviceWidth from '../utils/deviceWidth.js';

function Home() {
  const userData = useSelector((state) => state.auth.userData);
  const videos = useSelector((state) => state.videos.videos);
  const isMobile = deviceWidth();

  console.log("Videos list: ", videos)
  
  return (
    <div className='text-white w-full h-full'>
      {userData ? (
        <ListVideos videoList={videos} className={ isMobile ? "grid grid-cols-1 gap-2" : 'grid grid-cols-3 gap-4'}/>
      ) : (
        <p className='mt-4'>Please log in to access your account.</p>
      )}
    </div>
  )
}

export default Home