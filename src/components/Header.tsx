"use client";

import { useState } from "react";
import Logo from "@/assets/logo.svg";
import SearchIcon from "@/assets/icon-search.svg";
import XIcon from "@/assets/icon-x.svg";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <header>
        <div className="wrapper">
          <div className="header-content">
            <div className="header-logo">
              <Logo className="cursor-pointer" />
            </div>
            <div
              className="header-search cursor-pointer"
              onClick={() => setShowSearch((prev) => !prev)}
            >
              {showSearch ? (
                <XIcon />
              ) : (
                <SearchIcon />
              )}
            </div>
          </div>
        </div>
      </header>

      {showSearch && <SearchOverlay />}
    </>
  );
}
