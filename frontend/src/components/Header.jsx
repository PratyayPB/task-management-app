import React from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
const Header = () => {
  return (
    <>
      <header
        className="fixed top-0 w-full z-50"
        style={{
          background: "rgba(247,249,251,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex justify-between items-center h-16 px-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #4d44e3, #4034d7)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Task Management App
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Show when="signed-out" className="flex items-center ">
              <SignInButton className="mr-6 cursor-pointer" />
              <SignUpButton className="cursor-pointer" />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </nav>

          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>
      ;
    </>
  );
};

export default Header;
