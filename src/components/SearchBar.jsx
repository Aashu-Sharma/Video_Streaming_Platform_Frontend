import React from "react";

function SearchBar({isMobile, Search}) {
  return (
    <div
      className={`flex items-center justify-center ${
        !isMobile ? "w-[60%]" : "w-[65vw]"
      } `}
    >
      <div
        className={`searchBar flex items-center justify-between bg-transparent w-full rounded-lg border ${
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
  );
}

export default SearchBar;
