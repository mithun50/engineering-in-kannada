import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation  } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CoursePage } from "./pages/CoursePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import BackToTop from "./components/BackToTop";
import * as ga from './utils/analytics';

//Google analytics 
function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    ga.pageview(location.pathname + location.search);
  }, [location]);

  return <>{children}</>;
}



function App() {
  return (
    <BrowserRouter>
      <AnalyticsWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnalyticsWrapper>
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
