import axios from "axios";
import CoursesServices from "services/courses";
import UsersServices from "services/users";

import { NoChaptersError, YoutubeVideoError } from "types/errors";

import parseChapters from "utils/parseChapters";
import parseDurationToSeconds from "utils/parseDurationToSeconds";

const getVideoFromYoutubeAPI = async (
  requestedVideoId: string
): Promise<{
  videoId: any;
  publishDate: any;
  title: any;
  channelTitle: any;
  description: any;
  videoDuration: any;
  chapters: any;
}> => {
  const result = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${requestedVideoId}&key=${process.env.YOUTUBE_API_KEY}`
  );

  const items = await result.data.items;

  if (items.length !== 1) {
    throw new YoutubeVideoError("Problem with Youtube's video id");
  }

  const { snippet, contentDetails, id: videoId } = items[0];
  const videoDuration = parseDurationToSeconds(contentDetails.duration);

  const chapters = parseChapters(snippet.description, videoDuration);

  if (chapters.length === 0) {
    throw new NoChaptersError("Requested video has no chapters");
  }

  return {
    videoId: videoId,
    publishDate: snippet.publishedAt,
    title: snippet.title,
    channelTitle: snippet.channelTitle,
    description: snippet.description,
    videoDuration: videoDuration,
    chapters: chapters,
  };
};

const addToUserFromYoutube = async (
  username: string,
  requestedVideoId: string
) => {
  const {
    videoId,
    publishDate,
    title,
    channelTitle,
    description,
    videoDuration,
    chapters,
  } = await getVideoFromYoutubeAPI(requestedVideoId);

  await CoursesServices.add({
    id: videoId,
    publishDate: publishDate,
    title: title,
    channelTitle: channelTitle,
    description: description,
    duration: videoDuration,
    chapters: chapters,
  });

  const course = await CoursesServices.getOne(videoId);

  await UsersServices.addCourse(username, course);
};

export default addToUserFromYoutube;
