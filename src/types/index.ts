export interface Video {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  youtubeUrl: string;
  notesUrl: string;
  codingQuestionUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalVideos: number;
  starred?: boolean;
}

export interface CoursesData {
  courses: Course[];
}

export interface VideoData {
  courseId: string;
  videos: Video[];
}