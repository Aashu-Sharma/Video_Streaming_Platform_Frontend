import axios from "axios";
import React, { useState } from "react";

function SearchBar({ isMobile, Search }) {
  const [query, setQuery] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(query);

    try {
      const response = await axios.get("/api/v1/videos", {
        params:{
          query: query
        }
      })
      setQuery("");
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          } text-base focus:outline-none p-2  w-full`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="p-2" disabled = {!query.trim()}>
          <Search className="w-[20px] h-[20px] " />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
