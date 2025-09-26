import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import deviceWidth from "../utils/deviceWidth.js";
import { Button } from "./ui/button.jsx";

function DropdownComp({ trigger, items, className, children, menuClassName  }) {
  const isMobile = deviceWidth();
  return (
    <div>
      <DropdownMenu >
        <DropdownMenuTrigger className={className}>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={
            `bg-white absolute top-[10px] right-[-20px] w-[200px] text-black shadow-lg rounded-xl p-2 ${menuClassName}`
          }
        >
          {children && (
            <>
              <DropdownMenuLabel>{children}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          {items &&
            items.map((item, index) => (
              <DropdownMenuItem
                key={item}
                className={`text-lg text-black border-none hover:border hover:border-black font-semibold ${
                  !isMobile ? "text-lg" : "text-base"
                } `}
              >
                {!item.link? (
                  <Button onClick={item.onClick} className={item.className}>{item.label}</Button>
                ) : (
                  <Link to={item.link} className={item.className}>{item.label}</Link>
                )}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DropdownComp;
