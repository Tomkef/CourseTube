import withDbConnection from "middleware/withDbConnection";
import withAuth from "middleware/withAuth";

import { NextApiRequest, NextApiResponse } from "next";

import UsersServices from "services/users";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  username: string
) => {
  if (req.method !== "GET") {
    console.error("Bad request method");
    res.status(400).send({ message: `Bad request method` });
    return;
  }
  try {
    const userCourses = await UsersServices.getAllCourses(username);

    res.status(200).send({
      result: userCourses,
      message: `User's courses loaded successfully`,
    });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ message: `Error trying to get user's courses` });
    return;
  }
};

export default withAuth(withDbConnection(handler));
