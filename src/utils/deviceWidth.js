import React, {useState, useEffect} from 'react';

const MOBILE_BREAKPOINT = 768 

export default function deviceWidth() {
  const [isMobile, setIsMobile] = useState(undefined);
  
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    function onChange(){
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // return () => {
    // }
  }, [])

  return !!isMobile;
}

