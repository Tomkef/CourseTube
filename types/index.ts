import mongoose from "mongoose";
import { DefaultSession } from "next-auth";

export type Chapter = {
  id: number;
  time: number;
  title: string;
  duration: number;
  viewed: boolean;
};

export type Video = {
  id: string;
  publishDate: string;
  title: string;
  channelTitle: string;
  description: string;
  duration: number;
  completedPercent: number;
  lastWatchTime: number;
};

export type Note = {
  _id?: mongoose.Types.ObjectId;
  time: number;
  timeString: string;
  chapterId: number;
  chapterTitle: string;
  content: string;
};

export type UserCourse = {
  video: Video;
  chapters: Chapter[];
  notes: Note[];
};

export type AllCourses = {
  video: Video;
  chapters: Chapter[];
};

export interface customSession extends Omit<DefaultSession, "user"> {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    username?: string;
  };
}

export type SetCurrentChapterByTimeParams = {
  time?: number;
  loadedChapters?: Chapter[];
};

export type PlayerComponentProps = {
  videoId: string;
  chaptersLength: number;
  currentChapter: number;
  seekToLastWatchTime: () => void;
  //setCurrentChapterByTime: (params?: SetCurrentChapterByTimeParams) => void;
  handleChapterClick: (chapterId: number) => void;
  handleChaptersUpdates: () => void;
};
