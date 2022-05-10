import { useCallback, useEffect, useRef, useState } from "react";
import router from "next/router";
import mongoose from "mongoose";

import { useNotifications } from "@mantine/notifications";
import useAxios from "hooks/useAxios";

import YouTubePlayer from "react-player/youtube";

import {
  addNoteInDB,
  API_COURSES,
  deleteNoteFromDB,
  updateChaptersInDB,
  updateLastTimeInDB,
  updateNoteInDB,
} from "utils/DB/clientSide";

import {
  showErrorNotification,
  showSuccessNotification,
} from "utils/notifications";

import secondsToTimeString from "utils/secondsToTimeString";

import {
  Chapter,
  Note,
  SetCurrentChapterByTimeParams,
  UserCourse,
  Video,
} from "types";

const useCourse = (courseId: string) => {
  const {
    data: {
      result: courseFetchResult,
      message: courseFetchMessage,
      status: courseFetchStatus,
    },
    fetchData: getCourseData,
  } = useAxios();
  const [video, setVideo] = useState<Video | null>(null);
  const [chapters, setChapters] = useState<Chapter[] | null>(null);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [lastWatchTime, setLastWatchTime] = useState<number | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);

  const notifications = useNotifications();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const chaptersRefs = useRef<HTMLDivElement[] | null[]>([]);
  const playerRef = useRef<YouTubePlayer>(null);

  const moveChapterScroll = useCallback((chapterId: number) => {
    const newPosition = chaptersRefs?.current[chapterId]?.offsetTop;

    if (!newPosition) {
      const arbitraryGuessedPosition = chapterId * 80;
      scrollAreaRef.current?.scrollTo({
        top: arbitraryGuessedPosition,
        behavior: "smooth",
      });
    } else {
      scrollAreaRef.current?.scrollTo({
        top: newPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const toggleChapterViewed = useCallback(
    async (chapterId: number) => {
      const chaptersBeforeChange = [...chapters];
      const newStatus = !chapters[chapterId].viewed;

      const updatedChapters = [...chapters];
      updatedChapters[chapterId].viewed = newStatus;
      setChapters(updatedChapters);

      const response = await updateChaptersInDB(video.id, newStatus, chapterId);

      if (response.status === "Success") {
        const isChecked = updatedChapters[chapterId].viewed;
        if (isChecked) {
          showSuccessNotification({
            notifications,
            message: "Chapter marked as viewed",
            duration: 3000,
          });
        } else {
          showSuccessNotification({
            notifications,
            message: "Chapter marked as unviewed",
            duration: 3000,
          });
        }
      } else {
        showErrorNotification({
          notifications,
          message: "Error trying to toggle chapter's view status",
          duration: 3000,
        });
        setChapters(chaptersBeforeChange);
      }
    },
    [chapters, notifications, video]
  );

  const setCurrentChapterByTime = useCallback(
    (params?: SetCurrentChapterByTimeParams) => {
      const time = params?.time || playerRef?.current?.getCurrentTime();
      const chaptersArray = chapters || params?.loadedChapters;

      if (!chaptersArray || !time) {
        return;
      }

      const newCurrentChapterId: number = [...chaptersArray]
        .reverse()
        .find((chapter: Chapter) => chapter.time <= time).id;

      if (currentChapter !== newCurrentChapterId) {
        setCurrentChapter(newCurrentChapterId);
        moveChapterScroll(newCurrentChapterId);
        updateLastTimeInDB(courseId, Math.floor(time));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapters?.length, courseId, currentChapter, moveChapterScroll]
  );

  useEffect(() => {
    if (courseFetchStatus === "Error") {
      showErrorNotification({ notifications, message: courseFetchMessage });
      router.replace(`/courses`);
      return;
    }
    if (courseFetchStatus === "Success") {
      const userVideoObject: UserCourse = courseFetchResult.courseData;
      const isNewVideo: boolean = courseFetchResult.isNewUserVideo;

      if (isNewVideo) {
        showSuccessNotification({
          notifications,
          title: `Course was added to your list!`,
          message: `Have fun learning.`,
        });
      }

      setVideo(userVideoObject.video);
      setChapters(userVideoObject.chapters);
      setNotes(userVideoObject.notes);
      setLastWatchTime(userVideoObject.video.lastWatchTime);
      setCurrentChapterByTime({
        time: userVideoObject.video.lastWatchTime,
        loadedChapters: userVideoObject.chapters,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseFetchStatus]);

  useEffect(() => {
    getCourseData({ url: `${API_COURSES}/${courseId}`, method: "GET" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChaptersUpdates = () => {
    const currentTime: number | null = playerRef.current.getCurrentTime();

    if (currentChapter === null) {
      setCurrentChapterByTime({ time: currentTime });
      return;
    }

    const currentChapterObject = chapters[currentChapter];

    const chapterEndTime =
      currentChapterObject.time + currentChapterObject.duration;

    const chapterShouldBeMarkedAsViewedTime =
      currentChapterObject.time + currentChapterObject.duration * 0.8;

    const isStillInCurrentChapterTimeFrame =
      currentTime >= currentChapterObject.time && currentTime <= chapterEndTime;

    if (isStillInCurrentChapterTimeFrame) {
      const isChapterViewedUpdateNeeded =
        !currentChapterObject.viewed &&
        currentTime > chapterShouldBeMarkedAsViewedTime;

      if (isChapterViewedUpdateNeeded) {
        toggleChapterViewed(currentChapter);
      }
    } else {
      setCurrentChapterByTime({ time: currentTime });
    }
  };

  const addNote = useCallback(
    async (content: string) => {
      const time = playerRef.current.getCurrentTime();
      if (!time) {
        showErrorNotification({
          notifications,
          title: `Can't add note`,
          message: `Play the video first`,
        });
        return false;
      }
      const chapterId = currentChapter;
      const chapterTitle = chapters[currentChapter].title;
      const timeString = secondsToTimeString(time);
      const newNote: Note = {
        time,
        timeString,
        chapterTitle,
        content,
        chapterId,
      };

      const newNotesArray: Note[] = [...notes, newNote].sort((a, b) =>
        a.time > b.time ? 1 : b.time > a.time ? -1 : 0
      );

      const response = await addNoteInDB(courseId, newNotesArray);

      if (response.status === "Fail") {
        showErrorNotification({ notifications, message: response.message });
        return false;
      } else {
        setNotes(response.result);

        showSuccessNotification({
          notifications,
          message: response.message,
        });

        return true;
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapters?.length, courseId, currentChapter, notes, notifications]
  );

  const deleteNote = async (noteId: mongoose.Types.ObjectId) => {
    const notesCopy = [...notes];

    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

    const response = await deleteNoteFromDB(courseId, noteId);

    if (response.status === "Fail") {
      showErrorNotification({ notifications, message: response.message });
      setNotes(notesCopy);
    } else {
      showSuccessNotification({
        notifications,
        message: response.message,
      });
    }
  };

  const updateNote = async (
    noteId: mongoose.Types.ObjectId,
    noteContent: string
  ) => {
    const response = await updateNoteInDB(courseId, noteId, noteContent);

    if (response.status === "Fail") {
      showErrorNotification({ notifications, message: response.message });
    } else {
      showSuccessNotification({
        notifications,
        message: response.message,
      });

      setNotes(response.result);
    }
  };

  const handleChapterClick = useCallback(
    (chapterId: number): void => {
      setCurrentChapter(chapterId);
      playerRef.current.seekTo(chapters[chapterId].time);
      moveChapterScroll(chapterId);
      updateLastTimeInDB(courseId, chapters[chapterId].time);
      setLastWatchTime(chapters[chapterId].time);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapters?.length, courseId, moveChapterScroll]
  );

  const handleNoteClick = (chapterId: number, time: number) => {
    setCurrentChapter(chapterId);
    playerRef.current.seekTo(time);
    moveChapterScroll(chapterId);
  };

  const seekToLastWatchTime = () => {
    playerRef.current.seekTo(lastWatchTime);
  };

  return {
    seekToLastWatchTime,
    handleNoteClick,
    handleChapterClick,
    updateNote,
    deleteNote,
    addNote,
    handleChaptersUpdates,
    setCurrentChapterByTime,
    toggleChapterViewed,
    moveChapterScroll,
    video,
    chapters,
    notes,
    lastWatchTime,
    currentChapter,
    scrollAreaRef,
    chaptersRefs,
    playerRef,
  };
};

export default useCourse;
