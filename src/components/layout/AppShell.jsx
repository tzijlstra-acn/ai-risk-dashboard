import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

/**
 * AppShell — full-height dark layout.
 * Left sidebar (fixed 240px) + right content area with TopBar at top.
 */
export function AppShell({ children, searchTerm, onSearchChange, dataFreshness }) {
  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content area, offset by sidebar width */}
      <div className="flex flex-col flex-1 ml-60 min-h-0 overflow-hidden">
        <TopBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          dataFreshness={dataFreshness}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
