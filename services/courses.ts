import { Video } from "models/video";
import { Chapter } from "types";

type addCourseParams = {
  chapters: Chapter[];
  id: string;
  publishDate: string;
  title: string;
  channelTitle: string;
  description: string;
  duration: number;
};

const CoursesServices = {
  add: async ({
    chapters,
    id,
    publishDate,
    title,
    channelTitle,
    description,
    duration,
  }: addCourseParams) => {
    const videoObject = {
      video: {
        id,
        publishDate,
        title,
        channelTitle,
        description,
        duration,
      },
      chapters: chapters,
    };

    const video = new Video(videoObject);

    await video.save();
  },

  getOne: async (courseId: string) => {
    const courseFromAllDB = await Video.findOne({
      "video.id": courseId,
    });

    if (courseFromAllDB) {
      return courseFromAllDB;
    }

    return null;
  },

  getRecent: async (numOfCoursesToFetch: number) => {
    const videos = await Video.find({}, { video: 1 })
      .sort({ _id: -1 })
      .limit(numOfCoursesToFetch);

    return videos;
  },
};

export default CoursesServices;
