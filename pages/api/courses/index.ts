import withAuth from "middleware/withAuth";
import withDbConnection from "middleware/withDbConnection";

import { NextApiRequest, NextApiResponse } from "next";

import CoursesServices from "services/courses";
import UsersServices from "services/users";

const NUM_OF_MAX_RECENT_COURSES = 5;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  username: string
) => {
  switch (req.method) {
    case "GET":
      try {
        const courses = await CoursesServices.getRecent(
          NUM_OF_MAX_RECENT_COURSES
        );

        res.status(200).send({
          result: courses,
          message: "Latest added courses loaded successfully",
        });
      } catch (error) {
        console.error(error.message);
        res
          .status(400)
          .send({ message: "Error trying to get latest added courses" });
      }
      return;
    case "DELETE":
      try {
        const videoId = req.body.videoId;

        await UsersServices.deleteCourse(username, videoId);

        res.status(200).send({
          message: `Course was successfully deleted`,
        });
      } catch (error) {
        console.log("Error in delete API endpoint", error.message);
        res.status(400).send({ message: `Error trying to delete course` });
      }
      return;
    default:
      console.error("Bad request method");
      res.status(400).send({ message: "Bad request method" });
      return;
  }
};

export default withAuth(withDbConnection(handler));
