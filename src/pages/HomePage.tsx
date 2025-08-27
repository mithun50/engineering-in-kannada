import { useState } from 'react';
import coursesData from '../data/courses.json';
import { CourseCard } from '../components/CourseCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnnouncementBanner } from '../components/AnnouncementBanner';
import { ScrollToTop } from '../components/ScrollToTop'; 
import { Course } from '../types';
import { Search } from 'lucide-react';
import { useSearchStore } from '../store/search'; // 🟡 import global search
import { useBreakpoint } from '../utils/useBreakPoint';

export function HomePage() {
  const { query, setQuery } = useSearchStore();
  const [showSearch, setShowSearch] = useState(false);
  const isDesktop = useBreakpoint();
  
  const filteredCourses = (coursesData.courses as Course[]).filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase()) ||
    course.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark">
      <ScrollToTop /> {/* 🟢 Add the ScrollToTop component */}
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src="/images/logo.png"
              alt="Engineering in Kannada"
              className="h-50 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/200x50?text=Engineering+in+Kannada';
              }}
            />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Quality technical education in Kannada, 
            accessible to everyone. Start your learning journey today with my
            free and carefully curated content.
          </p>
        </div>

        <div className="mt-8">
          <AnnouncementBanner />
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-white text-center md:text-left">Available Courses</h2>
            <div className="flex w-full items-center justify-center space-x-2 md:w-auto md:justify-start">
              {isDesktop && (
                <button
                  onClick={() => setShowSearch((prev) => !prev)}
                  className="text-white hover:text-yellow-400"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6" />
                </button>
              )}
              {(!isDesktop || showSearch) && (
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-1 text-white focus:outline-none md:w-auto"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}
            </div>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-400">No courses found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
            }
            
