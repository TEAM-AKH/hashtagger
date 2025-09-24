
'use client';
import { Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// --- Main Component (Aurora Search Bar) ---
export const ChatSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [isFocused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    onSearch(query);
  }

  return (
    <div className="w-full max-w-sm">
      <label
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="relative flex w-full items-center"
        htmlFor="search-input"
      >
        <div
          className={`
            absolute -inset-0.5 z-0 rounded-xl bg-primary/20 blur-lg 
            transition-all duration-300 
            ${isFocused ? 'opacity-75' : 'opacity-0'}
          `}
        />
        <div
          className="
            absolute inset-0 z-0 rounded-xl 
            bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50
            transition-all duration-300
            animate-pulse
          "
        />
        <input
          ref={inputRef}
          id="search-input"
          value={value}
          onChange={handleSearch}
          placeholder="Find a conversation..."
          className="relative z-10 h-12 w-full rounded-xl border border-border bg-background/80 px-4 pl-12 text-foreground placeholder-muted-foreground outline-none backdrop-blur-sm"
        />
        <Search className="absolute left-4 z-20 h-5 w-5 text-muted-foreground" />
      </label>
    </div>
  );
};


// --- Alternative Component (Uncomment to use) ---
/*
export const ChatSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [value, setValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    onSearch(query);
  }

  return (
    <div className="group relative w-full max-w-sm">
      <div className="absolute inset-0.5 animate-tilt rounded-lg bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-lg transition-all duration-200 group-hover:opacity-100 group-hover:duration-200" />
      <div className="relative flex items-center">
        <div className="absolute left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleSearch}
          placeholder="Search chats..."
          className="relative w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-foreground shadow-lg"
        />
      </div>
    </div>
  );
};
*/
