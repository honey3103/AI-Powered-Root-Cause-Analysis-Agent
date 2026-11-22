/**
 * Project: AI-Powered Root Cause Analysis Agent
 * Author: Harsh (CSE)
 * File: App.jsx
 * Description: Main React routing setup with Coroot AI static black theme.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// import all application pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewAnalysisPage } from './pages/NewAnalysisPage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportViewPage } from './pages/ReportViewPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Wrapper Component
// If user is not logged in, redirect them to /login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // show clean spinner while checking localstorage auth token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="w-7 h-7 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-400">Loading workspace...</span>
        </div>
      </div>
    );
  }

  // user not logged in -> redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // user is logged in -> render sidebar + main page content
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-3.5rem)] bg-[#09090b]">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
            {/* Top Navigation */}
            <Navbar />

            {/* Application Routes */}
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Private routes (require user login) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/new-analysis"
                element={
                  <ProtectedRoute>
                    <NewAnalysisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis/:id"
                element={
                  <ProtectedRoute>
                    <AnalysisResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis/:id/report"
                element={
                  <ProtectedRoute>
                    <ReportViewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
