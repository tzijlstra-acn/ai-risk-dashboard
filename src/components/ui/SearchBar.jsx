import React, { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

/**
 * SearchBar — global search input with Cmd+K shortcut.
 * @param {string} value
 * @param {Function} onChange
 */
export function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search… (⌘K)"
        className="bg-surface-700 border border-surface-500 text-white text-xs rounded-lg pl-8 pr-3 py-1.5 w-52 placeholder:text-white/30 focus:outline-none focus:border-brand-purple focus:w-64 transition-all duration-200"
      />
    </div>
  );
}
