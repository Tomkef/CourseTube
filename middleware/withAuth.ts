import { NextApiRequest, NextApiResponse } from "next";

import { BadSessionError } from "types/errors";

import getUsernameFromSession from "utils/getUsernameFromSession";

const withAuth =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      username: string
    ) => Promise<void>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const username = await getUsernameFromSession(req);

      if (!username) {
        throw new BadSessionError("Bad session data");
      }

      return handler(req, res, username);
    } catch (error) {
      if (error.name === "BadSessionError") {
        console.log(`Unauthorized`);
        res.status(401).send({ message: "Unauthorized" });
        return;
      }
      console.log("Error trying to get session: ", { error });
      res.status(500).send({ message: "Something went wrong" });
      return;
    }
  };

export default withAuth;
