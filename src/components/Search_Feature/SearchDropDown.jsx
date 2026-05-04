import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

function SearchDropDown({ onSelect, getRecentSearches }) {
  const [recentSearches, setRecentSearches] = useState([]);

  function removeQuery(query) {
    const updated = recentSearches.filter((q) => q !== query);
    setRecentSearches(updated);
    window.localStorage.setItem("searchQuery", JSON.stringify(updated));
  }

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  if (recentSearches.length === 0) {
    return (
      <div className="absolute top-[50px] left-0 w-full bg-black border rounded-lg p-4 text-gray-400">
        No recent searches
      </div>
    );
  }

  return (
    <div className="absolute top-[50px] left-0 w-full bg-black border rounded-lg p-4">
      <ul>
        {recentSearches.map((query, index) => (
          <li
            key={`${query}-${index}`}
            className="flex justify-between items-center py-1 cursor-pointer hover:bg-gray-800"
          >
            <p onClick={() => onSelect(query)}>{query}</p>
            <X size={15} onClick={() => removeQuery(query)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchDropDown;
