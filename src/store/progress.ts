import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProgressState {
  completedVideos: string[];
  starredVideos: string[];
  starredCourses: string[];
  markVideoComplete: (videoId: string) => void;
  markVideoIncomplete: (videoId: string) => void;
  isVideoCompleted: (videoId: string) => boolean;
  toggleVideoStarred: (videoId: string) => void;
  isVideoStarred: (videoId: string) => boolean;
  toggleCourseStarred: (courseId: string) => void;
  isCourseStarred: (courseId: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedVideos: [],
      starredVideos: [],
      starredCourses: [],
      markVideoComplete: (videoId) => {
        set((state) => ({
          completedVideos: [...state.completedVideos, videoId],
        }));
      },
      markVideoIncomplete: (videoId) => {
        set((state) => ({
          completedVideos: state.completedVideos.filter(id => id !== videoId),
        }));
      },
      isVideoCompleted: (videoId) => {
        return get().completedVideos.includes(videoId);
      },
      toggleVideoStarred: (videoId) => {
        set((state) => ({
          starredVideos: state.starredVideos.includes(videoId)
            ? state.starredVideos.filter(id => id !== videoId)
            : [...state.starredVideos, videoId]
        }));
      },
      isVideoStarred: (videoId) => {
        return get().starredVideos.includes(videoId);
      },
      toggleCourseStarred: (courseId) => {
        set((state) => ({
          starredCourses: state.starredCourses.includes(courseId)
            ? state.starredCourses.filter(id => id !== courseId)
            : [...state.starredCourses, courseId]
        }));
      },
      isCourseStarred: (courseId) => {
        return get().starredCourses.includes(courseId);
      },
    }),
    {
      name: 'course-progress',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          // Handle migration from version 0 to 1
          return {
            ...persistedState,
            starredCourses: persistedState.starredCourses || [],
          };
        }
        return persistedState as ProgressState;
      },
    }
  )
);