import axios from "axios";
import mongoose from "mongoose";
import { Note } from "types";

const API_NOTES = `/api/notes`;
const API_DELETE_VIDEO = `/api/courses`;
export const API_USER_COURSES = `/api/courses/user`;
export const API_COURSES = `/api/courses`;
const API_TOGGLE_CHAPTER_VIEWED_STATE = `/api/toggleChapterViewed`;

type DBResult = {
  status: "Success" | "Fail";
  message: string;
  result?: Note[];
};

export const addNoteInDB: (
  videoId: string,
  notes: Note[]
) => Promise<DBResult> = async (videoId, notes) => {
  try {
    const response = await axios.post(API_NOTES, {
      notes: notes,
      videoId,
    });
    return {
      status: "Success",
      result: response.data.result,
      message: response.data.message,
    };
  } catch (error) {
    return { status: "Fail", message: error.response.data.message };
  }
};

export const updateNoteInDB: (
  videoId: string,
  noteId: mongoose.Types.ObjectId,
  noteContent: string
) => Promise<DBResult> = async (videoId, noteId, noteContent) => {
  try {
    const response = await axios.patch(API_NOTES, {
      noteId,
      videoId,
      noteContent,
    });
    return {
      status: "Success",
      result: response.data.result,
      message: response.data.message,
    };
  } catch (error) {
    return { status: "Fail", message: error.response.data.message };
  }
};

export const deleteNoteFromDB: (
  videoId: string,
  noteId: mongoose.Types.ObjectId
) => Promise<DBResult> = async (videoId, noteId) => {
  try {
    const response = await axios.delete(API_NOTES, {
      data: { noteId, videoId },
    });
    return {
      status: "Success",
      result: response.data.result,
      message: response.data.message,
    };
  } catch (error) {
    return { status: "Fail", message: error.response.data.message };
  }
};

export const updateLastTimeInDB: (
  videoId: string,
  currentTime: number
) => Promise<void> = async (videoId, currentTime) => {
  try {
    const result = await axios.patch(`/api/updateLastTime/${videoId}`, {
      lastWatchTime: Math.floor(currentTime),
    });
  } catch (error) {}
};

export const updateChaptersInDB: (
  videoId: string,
  isViewed: boolean,
  chapterId: number
) => Promise<DBResult> = async (videoId, isViewed, chapterId) => {
  try {
    const response = await axios.patch(API_TOGGLE_CHAPTER_VIEWED_STATE, {
      chapterId,
      videoId,
      isViewed,
    });
    return {
      status: "Success",
      message: response.data.message,
    };
  } catch (error) {
    return { status: "Fail", message: error.response.data.message };
  }
};

export const deleteCourseFromUserInDB: (
  videoId: string
) => Promise<DBResult> = async (videoId) => {
  try {
    const response = await axios.delete(API_DELETE_VIDEO, {
      data: { videoId },
    });
    return {
      status: "Success",
      message: response.data.message,
    };
  } catch (error) {
    return { status: "Fail", message: error.response.data.message };
  }
};
