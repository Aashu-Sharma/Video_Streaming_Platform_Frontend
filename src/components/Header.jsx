import React, { useEffect, useState } from "react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Play, Plus, Search, User } from "lucide-react";
import DropdownComp from "./DropdownComp";
import Avatar from "./AvatarComp.jsx";
import deviceWidth from "../utils/deviceWidth.js";
import { useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom';
import { logOut } from "../store/authSlice.js";
import axios from "axios";

function Header({ userData }) {
  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const [dropdownItems, setDropdownItems] = useState([]);
  const isMobile = deviceWidth();
  const { state } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/v1/users/logOut", {});
      if (response.status === 200) {
        console.log(response.data.message || "User logged out ");
        dispatch(logOut());
        navigate("/")
      }
    } catch (error) {
      console.error("Error logging out: ", error);
      // Handle error, maybe show a notification to the user
    }
  };

  const loggedOutDropdownItems = [
    {
      label: "Login",
      link: "/login",
    },
    {
      label: "Sign Up",
      link: "/signup",
    },
  ];

  const loggedInDropdownItems = [
    {
      label: "Profile",
      link: `/userProfile`,
    },
    {
      label: "Settings",
      link: "/settings",
    },
    {
      label: "Logout",
      onClick: () => {
        handleLogout();
      },
    },
  ];

  useEffect(() => {
    const checkUserLoggedIn = () => {
      if (!userData) {
        return setDropdownItems(loggedOutDropdownItems);
      } else {
        return setDropdownItems(loggedInDropdownItems);
      }
    };

    checkUserLoggedIn();
  }, [userData]);

  // console.log("Dropdown Items: ", dropdownItems);

  const navWidthClass =
    state === "expanded"
      ? "w-[calc(100vw - 150px)]"
      : "w-[calc(100vw - 100px)]";

  return (
    <nav
      className={`sticky inset-x-0 top-0 z-50 bg-black ml-1 text-white h-[70px] ${navWidthClass} ${
        !isMobile
          ? "flex items-center justify-between  px-4 py-0 "
          : "w-full flex flex-row justify-between py-2 px-1"
      }  border-b-2`}
    >
      <div
        className={`flex items-center justify-center ${
          !isMobile ? "gap-4" : "gap"
        } `}
      >
        <SidebarTrigger />
        <div className="logo flex items-center gap">
          <Play className="inline-block w-[20px] h-[20px]" />
          {!isMobile && <h1 className="text-xl">Vidstream</h1>}
        </div>
      </div>

      <div
        className={`flex items-center justify-center ${
          !isMobile ? "w-[60%]" : "w-[65vw]"
        } `}
      >
        <div
          className={`searchBar  flex items-center justify-between bg-transparent w-full rounded-lg border ${
            !isMobile ? "p-2 h-[40px]" : ""
          } `}
        >
          <input
            type="text"
            placeholder="Search"
            className={`${
              !isMobile && "w-full "
            } text-base focus:outline-none p-2`}
          />
          <Search className="w-[20px] h-[20px] " />
        </div>
      </div>

      <div className="flex items-center justify-center ">
        <DropdownComp
          trigger={<Plus className="w-[15px] h-[15px]" />}
          items={[
            {
              label: "Upload Video",
              link: "/upload-video",
            },
            {
              label: "Create Post",
              link: `/userProfile/posts`,
            },
          ]}
          className={`bg-trasnparent ${
            !isMobile ? "p-2 text-lg" : "p-1 text-base"
          }  border rounded-4xl `}
        />

        <DropdownComp
          trigger={<User className="w-[15px] h-[15px]" />}
          items={dropdownItems}
          className={`bg-trasnparent ${
            !isMobile ? "p-2 text-lg ml-4" : "p-1 text-[14px] ml-2"
          }  border rounded-4xl `}
        >
          <div className="flex items-center flex-row gap-2">
            <Avatar image={userData?.avatar} imageFallback={"avatar"} />
            <span className="text-lg ">{userData?.username}</span>
          </div>
        </DropdownComp>
      </div>
    </nav>
  );
}

export default Header;
