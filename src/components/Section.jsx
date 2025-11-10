import React from "react";
import { SquareChevronLeft, SquareChevronRight } from "lucide-react";
import { deviceWidth } from "../utils/index.js";
import { Link } from "react-router-dom";

function Section({
  sectionTitle,
  children,
  canMoveLeft,
  canMoveRight,
  moveLeft,
  moveRight,
  viewAllRoute
}) {
  const isMobile = deviceWidth();
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <h2 className={`font-bold ${isMobile ? "text-lg" : "text-2xl "}`}>
          {sectionTitle}
        </h2>
        <div className="buttons flex flex-row items-center gap-2">
          <Link to={viewAllRoute} className={`bg-transparent text-lg`}>
            View All
          </Link>
          <div className="arrowButons flex flex-row items-center gap-2">
            <SquareChevronLeft
              size={isMobile ? 20 : 30}
              onClick={() => canMoveLeft && moveLeft()}
              className={!canMoveLeft && "opacity-[0.5]"}
            />
            <SquareChevronRight
              size={isMobile ? 20 : 30}
              onClick={() => canMoveRight && moveRight()}
              className={!canMoveRight && "opacity-[0.5]"}
            />
          </div>
        </div>
      </div>
      <div
        className={`w-full flex  ${
          isMobile ? "justify-between gap-2" : "flex-row gap-4"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Section;
