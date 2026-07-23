import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Govern } from './routes/Govern';
import { Map } from './routes/Map';
import { Measure } from './routes/Measure';
import { Manage } from './routes/Manage';
import { ModelDetail } from './routes/ModelDetail';

/**
 * App — React Router v6 setup with AppShell layout.
 * Default landing: /measure
 * Global search state is lifted here and passed to relevant routes.
 */
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  // Reset search when navigating between routes
  const handleSearchChange = (val) => setSearchTerm(val);

  return (
    <AppShell searchTerm={searchTerm} onSearchChange={handleSearchChange}>
      <Routes>
        <Route path="/" element={<Navigate to="/measure" replace />} />
        <Route path="/govern" element={<Govern />} />
        <Route path="/map" element={<Map searchTerm={searchTerm} />} />
        <Route path="/measure" element={<Measure />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/models/:id" element={<ModelDetail />} />
        <Route path="*" element={<Navigate to="/measure" replace />} />
      </Routes>
    </AppShell>
  );
}
