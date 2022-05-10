import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const withDbConnection =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      username?: string
    ) => Promise<void>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse, username?: string) => {
    try {
      const isConnectionReady = mongoose.connections[0].readyState;

      if (!isConnectionReady) {
        await mongoose.connect(process.env.MONGODB_URI);
      }

      if (username) {
        return handler(req, res, username);
      } else {
        return handler(req, res);
      }
    } catch (error) {
      console.log("Error trying to connect to database: ", error.message);
      res.status(500).send({ message: "Something went wrong" });
      return;
    }
  };

export default withDbConnection;
