"use client";

import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MoonIcon from "@/assets/icon-moon.svg";
import SunIcon from "@/assets/icon-sun.svg";

export default function Footer() {
  const { setTheme } = useContext(ThemeContext);

  return (
    <footer>
      <div className="wrapper">
        <div className="footer-content">
          <div className="flex items-center">
            <div className="footer-content__moon" onClick={() => setTheme('dark')}>
              <MoonIcon className="cursor-pointer" />
            </div>
            <div className="footer-content__sun" onClick={() => setTheme('light')}>
              <SunIcon className="cursor-pointer" />
            </div>
            <div className="footer-content__links">
              <button>Contact us</button>
              <button>Privacy Policy</button>
              <button>Terms of use</button>
              <button>DMCA Policy</button>
            </div>
          </div>
          <div className="footer-content__company">
            <p>© Aras Digital Products 2024</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
