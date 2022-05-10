import { User } from "models/user";
import { AllCourses } from "types";

const UsersServices = {
  getCourse: async (username: string, videoId: string) => {
    const userCourseArray = await User.findOne(
      {
        username: username,
        "videos.video.id": videoId,
      },
      { "videos.$": true }
    );

    const course = userCourseArray?.videos[0];

    return course;
  },
  getAllCourses: async (username: string) => {
    let videosResult = await User.findOne(
      { username: username },
      {
        videos: { video: 1 },
      }
    );

    return videosResult.videos;
  },

  addCourse: async (username: string, course: AllCourses) => {
    const userVideoObject = {
      video: { ...course.video, lastWatchTime: 0, completedPercent: 0 },
      chapters: course.chapters,
      notes: [],
    };

    let updateResult = await User.updateOne(
      {
        username: username,
      },
      { $push: { videos: userVideoObject } }
    );

    if (updateResult.modifiedCount !== 1) {
      throw new Error(`Problem while updating user's courses`);
    }
  },

  deleteCourse: async (username: string, courseId: string) => {
    const result = await User.updateOne(
      { username: username },
      { $pull: { videos: { "video.id": courseId } } }
    );

    if (result.modifiedCount === 0) {
      throw Error("The course wasn't found in user's courses.");
    }
  },

  getByEmail: async (email: string) => {
    return await User.findOne({ email: email });
  },

  getByUsername: async (username: string) => {
    return await User.findOne({ username: username });
  },

  create: async ({
    username,
    email,
    hashedPassword,
  }: {
    username: string;
    email: string;
    hashedPassword: string;
  }) => {
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      videos: [],
      notes: [],
    });

    await user.save();
  },
};

export default UsersServices;
