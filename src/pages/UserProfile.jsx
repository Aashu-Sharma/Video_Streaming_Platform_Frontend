import React from "react";
import Profile from '../components/Profile.jsx'
import { useSelector } from "react-redux";

function UserProfile() {
  const userData = useSelector((state) => state.auth.userData);
  const userVideos = useSelector((state) => state.auth.userVideos);
  
  if (!userData) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-black w-full h-full min-h-screen text-white">
      <Profile profileData={userData} channelVideos={userVideos}/>
    </div>
  );
}

export default UserProfile;
