import { NextApiRequest, NextApiResponse } from "next";

import withDbConnection from "middleware/withDbConnection";
import withAuth from "middleware/withAuth";

import UsersServices from "services/users";
import CoursesServices from "services/courses";
import { BadRequestError } from "types/errors";

import addToUserFromYoutube from "utils/addToUserFromYoutube";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  username: string
) => {
  try {
    if (req.method !== "GET") {
      throw new BadRequestError("Bad request method");
    }

    const requestedVideoId = req.query.id as string;

    if (await handleIfFoundInUserDB(username, requestedVideoId, res)) {
      return;
    }

    if (await handleIfFoundInAllDB(username, requestedVideoId, res)) {
      return;
    }

    await handleAddFromYoutube(username, requestedVideoId, res);
  } catch (error) {
    console.log({ error });

    if (error.name === "BadRequestError") {
      res.status(400).send({ message: error.message });
      return;
    }

    if (error.name === "NoChaptersError") {
      res.status(406).send({ message: error.message });
      return;
    }

    if (error.name === "YoutubeVideoError") {
      res.status(400).send({ message: error.message });
      return;
    }

    res.status(400).send({ message: `Error trying to load course's data` });
    return;
  }
};

export default withAuth(withDbConnection(handler));

const handleIfFoundInUserDB = async (
  username: string,
  requestedVideoId: string,
  res: NextApiResponse
) => {
  const courseFromUserDB = await UsersServices.getCourse(
    username,
    requestedVideoId
  );

  if (courseFromUserDB) {
    res.status(200).send({
      result: { courseData: courseFromUserDB, isNewUserVideo: false },
      message: "Course loaded successfully",
    });
    return true;
  }
  return false;
};

const handleIfFoundInAllDB = async (
  username: string,
  requestedVideoId: string,
  res: NextApiResponse<any>
) => {
  const courseFromAllDB = await CoursesServices.getOne(requestedVideoId);

  if (courseFromAllDB) {
    await UsersServices.addCourse(username, courseFromAllDB);

    const courseData = await UsersServices.getCourse(
      username,
      requestedVideoId
    );

    res.status(200).send({
      result: { courseData: courseData, isNewUserVideo: true },
      message: "Course added to user courses",
    });
    return true;
  }
  return false;
};

const handleAddFromYoutube = async (
  username: string,
  requestedVideoId: string,
  res: NextApiResponse<any>
) => {
  await addToUserFromYoutube(username, requestedVideoId);

  const courseData = await UsersServices.getCourse(username, requestedVideoId);

  res.status(200).send({
    result: { courseData: courseData, isNewUserVideo: true },
    message: "Course added successfully",
  });
  return true;
};
