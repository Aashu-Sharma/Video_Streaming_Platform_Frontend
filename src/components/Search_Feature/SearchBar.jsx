import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {useNavigate} from 'react-router-dom';
import { SearchDropDown } from "./index.js";

function SearchBar({ isMobile, Search }) {
  const [query, setQuery] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const getStoredSearches = () => {
    const stored = window.localStorage.getItem("searchQuery");
    return stored ? JSON.parse(stored) : [];
  };

  const saveNewSearch = (newQuery) => {
    let searches = getStoredSearches();
    searches = searches.filter((s) => s !== newQuery);
    searches.unshift(newQuery);
    searches = searches.slice(0, 5);
    localStorage.setItem("searchQuery", JSON.stringify(searches));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    try {
      saveNewSearch(trimmed);
      const response = await axios.get("/api/v1/videos", {
        params: {
          query: trimmed,
        },
      });
      setQuery("");
      setShowDropDown(false);
      navigate(`searchResults?q=${trimmed}`, {
        state: {
          results: response.data
        }
      })
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropDown(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchRef}
      className={`relative ${!isMobile ? "w-[60%]" : "w-[65vw]"}`}
    >
      <form
        onSubmit={handleSubmit}
        className={`flex items-center justify-center w-full`}
      >
        <div
          className={`searchBar flex items-center justify-between bg-transparent w-full rounded-lg border ${
            !isMobile ? "p-2 h-[40px]" : ""
          } `}
        >
          <input
            type="text"
            placeholder="Search"
            onClick={() => setShowDropDown(true)}
            className={`${
              !isMobile && "w-full "
            } text-base focus:outline-none p-2  w-full`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="p-2" disabled={!query.trim()}>
            <Search className="w-[20px] h-[20px] " />
          </button>
        </div>
      </form>

      {showDropDown && (
        <SearchDropDown
          onSelect={(q) => {
            setQuery(q);
            setShowDropDown(false);
          }}
          getRecentSearches={getStoredSearches}
        />
      )}
    </div>
  );
}

export default SearchBar;
