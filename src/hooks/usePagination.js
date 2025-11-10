import { useState, useEffect } from "react";

export default function usePagination(
  items = [],
  itemsPerPage = 4,
  maxCount = 10
) {
  const [displayHistory, setDisplayHistory] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [activeHistory, setActiveHistory] = useState([]);

  useEffect(() => {
    const limited = items?.slice(0, maxCount);
    setDisplayHistory(limited);
    setStartIndex(0);
    setActiveHistory(limited?.slice(0, itemsPerPage));
  }, [items, itemsPerPage, maxCount]);

  const canMoveRight = startIndex + itemsPerPage < displayHistory?.length;
  const canMoveLeft = startIndex > 0;

  const moveRight = () => {
    let nextIndex = startIndex + itemsPerPage;
    if (nextIndex + itemsPerPage > displayHistory?.length) {
      nextIndex = Math.max(displayHistory?.length - itemsPerPage, 0);
      console.log("nextIndex: ", nextIndex);
    }

    if (nextIndex < displayHistory?.length) {
      setStartIndex(nextIndex);
      console.log("StartIndex: ", startIndex);
      setActiveHistory(
        displayHistory?.slice(nextIndex, nextIndex + itemsPerPage)
      );
    }
  };

  const moveLeft = () => {
    let prevIndex = Math.max(startIndex - itemsPerPage, 0);
    setStartIndex(prevIndex);
    setActiveHistory(displayHistory?.slice(prevIndex, prevIndex + itemsPerPage));
  };

  return {
    activeHistory,
    canMoveLeft,
    canMoveRight,
    moveLeft,
    moveRight
  }
}
