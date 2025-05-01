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

// Google analytics 
function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    ga.pageview(location.pathname + location.search);
  }, [location]);

  return <>{children}</>;
}

// Layout component to include Header with all routes
function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set up a MutationObserver to fix Google Translate issues
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && document.body.style.top) {
          // Reset the top style that Google Translate adds
          const scrollTop = parseInt(document.body.style.top, 10) * -1;
          document.body.style.removeProperty('top');
          document.body.style.position = 'static';
          window.scrollTo(0, scrollTop);
        }
      });
    });
    
    // Start observing the body element for attribute changes
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style'] 
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      {/* Google Translate Element container will be created once */}
      <div id="google_translate_element" className="hidden"></div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsWrapper>
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
      </AnalyticsWrapper>
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
