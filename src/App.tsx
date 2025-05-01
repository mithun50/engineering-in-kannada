// src/App.tsx

import React from "react";
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

  React.useEffect(() => {
    ga.pageview(location.pathname + location.search);
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
