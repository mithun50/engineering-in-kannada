// src/App.tsx

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CoursePage } from "./pages/CoursePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { Blogs } from './pages/Blogs';
import { BlogPost } from './pages/BlogPost';
import { Header } from "./components/Header";
import BackToTop from "./components/BackToTop";
import * as ga from './utils/analytics';
import translateService from "./services/TranslateService";
import "./components/GoogleTranslate.css";

// Analytics and translation wrapper
function AnalyticsAndTranslationWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics page view tracking
    ga.pageview(location.pathname + location.search);
    
    // Handle translation on route change - apply after a delay to ensure content is loaded
    setTimeout(() => {
      translateService.applyStoredTranslation(300);
    }, 500);
  }, [location]);

  return <>{children}</>;
}

// Layout component to include Header with all routes
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
    </>
  );
}

function App() {
  // Initialize translation service and monitoring
  useEffect(() => {
    // Initialize translation service
    translateService.initialize().then(() => {
      console.log("Translation service initialized");
    });
    
    // Set up continuous monitoring for Google Translate modifications
    translateService.setupMonitoring();
    
    // Add event listener for content loaded
    window.addEventListener('DOMContentLoaded', () => {
      translateService.applyStoredTranslation();
    });
    
    // Add event listener for page visibility changes
    // This helps when users return to the tab and may need translation reapplied
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        translateService.applyStoredTranslation();
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <AnalyticsAndTranslationWrapper>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<HomePage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AnalyticsAndTranslationWrapper>
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
