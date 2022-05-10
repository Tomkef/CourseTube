import { User } from "models/user";
import { Chapter } from "types";
import { NextApiRequest, NextApiResponse } from "next";
import withDbConnection from "middleware/withDbConnection";
import withAuth from "middleware/withAuth";

interface CustomApiRequest extends Omit<NextApiRequest, "body"> {
  body?: {
    chapterId: number;
    videoId: string;
    isViewed: boolean;
  };
}

const handler = async (
  req: CustomApiRequest,
  res: NextApiResponse,
  username: string
) => {
  try {
    const videoId = req.body.videoId;
    const chapterId = req.body.chapterId;
    const isViewed = req.body.isViewed;

    if (isNaN(chapterId) || typeof isViewed !== "boolean") {
      res.status(400).send({ message: "Bad request" });
      return;
    }

    let courseData = await User.findOne(
      {
        username,
        "videos.video.id": videoId,
      },
      { "videos.$": true }
    );

    courseData = courseData?.videos[0];

    if (!courseData) {
      throw new Error("Error trying to get course data");
    }

    const courseDuration = courseData.video.duration;
    const chapters = courseData.chapters;

    const reduceDuration = (currentTotal: number, chapter: Chapter) => {
      const isViewed =
        (chapter.id === chapterId && !chapter.viewed) ||
        (chapter.id !== chapterId && chapter.viewed);

      const durationToAdd = isViewed ? chapter.duration : 0;

      return currentTotal + durationToAdd;
    };

    const viewedDuration: number = chapters.reduce(reduceDuration, 0);

    const viewedPercentage = ((viewedDuration / courseDuration) * 100).toFixed(
      0
    );

    const result = await User.updateOne(
      { username: username, "videos.video.id": videoId },
      {
        $set: {
          "videos.$.chapters.$[chapter].viewed": isViewed,
          "videos.$.video.completedPercent": viewedPercentage,
        },
      },
      {
        arrayFilters: [{ "chapter.id": chapterId }],
      }
    );

    if (result.modifiedCount !== 1) {
      throw new Error(
        `DB modification of chapter viewed status and course completed percent didn't work`
      );
    }

    res.status(200).send({ message: `Toggled chapter's viewed status` });
    return;
  } catch (error) {
    console.log("Error in toggleChapterViewed API endpoint: ", error.message);
    res.status(400).send({ message: "Something went wrong" });
    return;
  }
};

export default withAuth(withDbConnection(handler));
