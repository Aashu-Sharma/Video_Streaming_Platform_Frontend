import React, { useRef } from "react";
import { PlaylistForm } from "./index.js";
import { useClickOutside } from "../hooks/useClickOutside.js";

function PlaylistModal({ playlist, setDisplayForm }) {
  const modalRef = useRef();

  useClickOutside(modalRef, () => setDisplayForm(false));
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div
        ref={modalRef}
        className="w-[50%] h-[50%] absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-2 items-center bg-black border rounded-lg text-white "
      >
        <PlaylistForm playlist={playlist} setDisplayForm={setDisplayForm} />
      </div>
    </div>
  );
}

export default PlaylistModal;
