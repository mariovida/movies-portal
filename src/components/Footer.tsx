"use client";

import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MoonIcon from "@/assets/icon-moon.svg";
import SunIcon from "@/assets/icon-sun.svg";

export default function Footer() {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <footer>
      <div className="wrapper">
        <div className="footer-content">
          <div className="footer-content__moon" onClick={toggleTheme}>
            <MoonIcon className="cursor-pointer" />
          </div>
          <div className="footer-content__sun" onClick={toggleTheme}>
            <SunIcon className="cursor-pointer" />
          </div>
          <div className="footer-content__links">
            <button>Contact us</button>
            <button>Privacy Policy</button>
            <button>Terms of use</button>
            <button>DMCA Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
