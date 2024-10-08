import React, { useContext } from "react";
import Link from "next/link";
import MobileHeader from "@/components/layout/MobileHeader";
import DesktopHeader from "@/components/layout/DesktopHeader";
import SettingsContext from "@/lib/SettingsContext";

const Header = () => {
  const { showHeader } = useContext(SettingsContext);
  return (
    <header
      className={`${showHeader ? "sticky" : "hidden"} left-0 top-0 z-[50] h-20 w-full justify-center bg-[#ffffffb8] backdrop-blur-[20px] backdrop-saturate-[180%]`}
    >
      <div className="m-auto flex h-full w-full max-w-screen-xl justify-between px-6 sm:px-16">
        {/* 1280px */}
        <div className="w-full items-center flex">
          <Link
            className="text-black font-semibold flex items-end gap-x-4 hover:opacity-60"
            href="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="35"
              viewBox="0 0 30 35"
              fill="none"
            >
              <path
                d="M4.03846 34.6154H1.73077C1.27174 34.6154 0.831513 34.433 0.506931 34.1085C0.182348 33.7839 0 33.3436 0 32.8846V22.5C0 22.041 0.182348 21.6007 0.506931 21.2762C0.831513 20.9516 1.27174 20.7692 1.73077 20.7692H4.03846C4.49749 20.7692 4.93772 20.9516 5.2623 21.2762C5.58688 21.6007 5.76923 22.041 5.76923 22.5V32.8846C5.76923 33.3436 5.58688 33.7839 5.2623 34.1085C4.93772 34.433 4.49749 34.6154 4.03846 34.6154ZM20.1923 34.6154H17.8846C17.4256 34.6154 16.9854 34.433 16.6608 34.1085C16.3362 33.7839 16.1538 33.3436 16.1538 32.8846V15.5769C16.1538 15.1179 16.3362 14.6777 16.6608 14.3531C16.9854 14.0285 17.4256 13.8462 17.8846 13.8462H20.1923C20.6513 13.8462 21.0916 14.0285 21.4161 14.3531C21.7407 14.6777 21.9231 15.1179 21.9231 15.5769V32.8846C21.9231 33.3436 21.7407 33.7839 21.4161 34.1085C21.0916 34.433 20.6513 34.6154 20.1923 34.6154ZM28.2692 34.6154H25.9615C25.5025 34.6154 25.0623 34.433 24.7377 34.1085C24.4131 33.7839 24.2308 33.3436 24.2308 32.8846V7.5C24.2308 7.04097 24.4131 6.60074 24.7377 6.27616C25.0623 5.95158 25.5025 5.76923 25.9615 5.76923H28.2692C28.7283 5.76923 29.1685 5.95158 29.4931 6.27616C29.8177 6.60074 30 7.04097 30 7.5V32.8846C30 33.3436 29.8177 33.7839 29.4931 34.1085C29.1685 34.433 28.7283 34.6154 28.2692 34.6154ZM12.1154 34.6154H9.80769C9.34866 34.6154 8.90844 34.433 8.58385 34.1085C8.25927 33.7839 8.07692 33.3436 8.07692 32.8846V1.73077C8.07692 1.27174 8.25927 0.831513 8.58385 0.506931C8.90844 0.182348 9.34866 0 9.80769 0H12.1154C12.5744 0 13.0146 0.182348 13.3392 0.506931C13.6638 0.831513 13.8462 1.27174 13.8462 1.73077V32.8846C13.8462 33.3436 13.6638 33.7839 13.3392 34.1085C13.0146 34.433 12.5744 34.6154 12.1154 34.6154Z"
                fill="url(#paint0_linear_1273_161)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1273_161"
                  x1="5.53846"
                  y1="9.54725"
                  x2="32.1231"
                  y2="39.8769"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5433FF" />
                  <stop offset="1" />
                </linearGradient>
              </defs>
            </svg>
            <p>KHYN HQ</p>
          </Link>
        </div>
        <MobileHeader />
        <DesktopHeader />
      </div>
    </header>
  );
};

export default Header;
