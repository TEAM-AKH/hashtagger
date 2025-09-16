
"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function HaloSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isOpen])

  return (
    <>
      <style jsx>{`
        #halo-search-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #search-wrapper {
          position: relative;
          width: ${isOpen ? "301px" : "44px"};
          height: 44px;
          transition: width 0.5s ease;
        }

        .search-field {
          background-color: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          width: 100%;
          height: 44px;
          border-radius: 10px;
          color: hsl(var(--foreground));
          padding-right: 60px;
          padding-left: 16px;
          font-size: 14px;
          opacity: ${isOpen ? 1 : 0};
          transition: opacity 0.5s ease;
          pointer-events: ${isOpen ? "auto" : "none"};
        }

        .search-field::placeholder {
          color: hsl(var(--muted-foreground));
        }

        .search-field:focus {
          outline: none;
        }
        
        .halo-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${isOpen ? '314px' : '56px'};
            height: ${isOpen ? '58px' : '56px'};
            transition: width 0.5s ease, height 0.5s ease;
        }

        .inner-glow,
        .main-border,
        .outer-ring,
        .aurora-glow {
          max-height: 100%;
          max-width: 100%;
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden;
          z-index: -1;
          border-radius: 12px;
          filter: blur(3px);
          top:0;
          left:0;
        }

        .inner-glow {
          height: calc(100% - 14px);
          width: calc(100% - 14px);
          top: 7px;
          left: 7px;
          border-radius: 10px;
          filter: blur(2px);
        }

        .inner-glow::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            hsl(var(--primary)),
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            hsl(var(--accent)),
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }

        .main-border {
          height: calc(100% - 4px);
          width: calc(100% - 4px);
          top: 2px;
          left: 2px;
          border-radius: 11px;
          filter: blur(0.5px);
        }

        .main-border::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          position: absolute;
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            hsl(var(--background)),
            hsl(var(--primary) / 0.8), 5%,
            hsl(var(--background)), 14%,
            hsl(var(--background)), 50%,
            hsl(var(--accent) / 0.8), 60%,
            hsl(var(--background)), 64%
          );
          transition: all 2s;
        }

        .outer-ring {
            max-height: 100%;
            max-width: 100%;
        }

        .outer-ring::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            hsl(var(--primary) / 0.5),
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            hsl(var(--accent) / 0.5),
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }

        .aurora-glow {
          overflow: hidden;
          filter: blur(30px);
          opacity: 0.4;
          width: calc(100% + 40px);
          height: calc(100% + 40px);
          top: -20px;
          left: -20px;
        }

        .aurora-glow:before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          position: absolute;
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
           background-image: conic-gradient(
            hsl(var(--background)),
            hsl(var(--primary)) 5%,
            hsl(var(--background)) 38%,
            hsl(var(--background)) 50%,
            hsl(var(--accent)) 60%,
            hsl(var(--background)) 87%);
          transition: all 2s;
        }

        .search-btn-border {
          height: 38px;
          width: 38px;
          position: absolute;
          overflow: hidden;
          top: 3px;
          right: ${isOpen ? '3px' : 'calc(50% - 19px)'};
          transition: right 0.5s ease;
          border-radius: 9px;
        }

        .search-btn-border::before {
          content: "";
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.35);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            hsl(var(--muted-foreground)),
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0) 50%,
            hsl(var(--muted-foreground)),
            rgba(0, 0, 0, 0) 100%
          );
          animation: rotate 4s linear infinite;
        }

        .search-button {
            position: absolute;
            top: 3px;
            right: ${isOpen ? '3px' : 'calc(50% - 19px)'};
            transition: right 0.5s ease;
            height: 38px;
            width: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            cursor: pointer;
            border-radius: 9px;
            background-color: hsl(var(--background));
        }

        #halo-search-container:hover > .halo-effect .outer-ring::before {
          transform: translate(-50%, -50%) rotate(-98deg);
        }

        #halo-search-container:hover > .halo-effect .aurora-glow::before {
          transform: translate(-50%, -50%) rotate(-120deg);
        }

        #halo-search-container:hover > .halo-effect .inner-glow::before {
          transform: translate(-50%, -50%) rotate(-97deg);
        }

        #halo-search-container:hover > .halo-effect .main-border::before {
          transform: translate(-50%, -50%) rotate(-110deg);
        }

        #halo-search-container:focus-within > .halo-effect .outer-ring::before {
          transform: translate(-50%, -50%) rotate(442deg);
          transition: all 4s;
        }

        #halo-search-container:focus-within > .halo-effect .aurora-glow::before {
          transform: translate(-50%, -50%) rotate(420deg);
          transition: all 4s;
        }

        #halo-search-container:focus-within > .halo-effect .inner-glow::before {
          transform: translate(-50%, -50%) rotate(443deg);
          transition: all 4s;
        }

        #halo-search-container:focus-within > .halo-effect .main-border::before {
          transform: translate(-50%, -50%) rotate(430deg);
          transition: all 4s;
        }

        #search-wrapper:focus-within > #text-mask {
          display: none;
        }

        @keyframes rotate {
          100% {
            transform: translate(-50%, -50%) rotate(450deg);
          }
        }
      `}</style>
      <div id="halo-search-container" ref={searchRef}>
        <div className="halo-effect">
            <div className="aurora-glow"></div>
            <div className="outer-ring"></div>
            <div className="outer-ring"></div>
            <div className="outer-ring"></div>
            <div className="inner-glow"></div>
            <div className="main-border"></div>
        </div>

        <div id="search-wrapper">
          <input
            ref={inputRef}
            placeholder="Search..."
            type="text"
            name="text"
            className="search-field"
          />
          <div id="text-mask" style={{display: isOpen ? '' : 'none', background: 'linear-gradient(90deg, transparent, hsl(var(--background)))'}}></div>
          <div className="search-btn-border"></div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "search-button flex items-center justify-center z-[2] isolate overflow-hidden"
            )}
          >
            <Search className="size-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </>
  );
}
