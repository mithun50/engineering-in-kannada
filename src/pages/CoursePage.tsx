import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import coursesData from '../data/courses.json';
import { VideoCard } from '../components/VideoCard';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useProgressStore } from '../store/progress';
import { Video } from '../types';
import { ToastContainer } from 'react-toastify';
import { dispatchToast } from '../utils/toastWithCustomMessages';
import { useBreakpoint } from '../utils/useBreakPoint';

// Create a component to render the video list
const VideoList = React.lazy(() => {
  const VideoListComponent = ({ courseId }: { courseId: string }) => {
    const [videos, setVideos] = React.useState<Video[]>([]);
    const { completedVideos } = useProgressStore();
    
    React.useEffect(() => {
      const loadVideos = async () => {
        const videoData = await import(`../data/videos/${courseId}.json`);
        setVideos(videoData.videos);
      };
      
      loadVideos();
    }, [courseId]);
    
    const completedCount = videos.filter(video => completedVideos.includes(video.id)).length;
    const progress = videos.length > 0 ? (completedCount / videos.length) * 100 : 0;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Progress: {Math.round(progress)}%</h3>
          <div className="h-2 w-32 rounded-full bg-white/10">
          <ToastContainer
          toastClassName={'custom-toast'}
          />
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    );
  };
  
  return Promise.resolve({ default: VideoListComponent });
});

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = coursesData.courses.find((c) => c.id === courseId);
  const isDesktop = useBreakpoint();
  
  // Share handler for the course
  const handleShare = async () => {
    if (!course) return;
    const url = `${window.location.origin}/course/${course.id}`;

    // Always copy to clipboard first
    try {
      await navigator.clipboard.writeText(url);
      dispatchToast(
        "Link copied to clipboard!",
        isDesktop ? "top-right" : "bottom-center"
      );
    } catch (err) {
      dispatchToast(
        "Failed to copy link",
        isDesktop ? "top-right" : "bottom-center"
      );
    }

    // Then try to open share modal
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          url,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          dispatchToast(
            "Share failed",
            isDesktop ? "top-right" : "bottom-center"
          );
        }
      }
    }
  };
  
  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Course not found</h2>
          <Link to="/" className="mt-4 text-primary hover:text-primary/80">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
        </div>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl flex items-center gap-3">
              {course.title}
              <button
                onClick={handleShare}
                className="ml-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Share course"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </h1>
            <p className="mt-2 text-white/60">{course.description}</p>
          </div>
        </div>
        <Suspense fallback={<div className="text-white">Loading videos...</div>}>
          <VideoList courseId={courseId!} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}