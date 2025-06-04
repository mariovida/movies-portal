"use client";

import Logo from "@/assets/logo.svg";
import SearchIcon from "@/assets/icon-search.svg";

export default function Header() {
  return (
    <header>
      <div className="wrapper">
        <div className="header-content">
          <div className="header-logo">
            <Logo className="cursor-pointer" />
          </div>
          <div className="header-search">
            <SearchIcon className="cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}
