import withAuth from "middleware/withAuth";
import withDbConnection from "middleware/withDbConnection";
import { User } from "models/user";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  username: string
) => {
  try {
    const lastWatchTime = req.body.lastWatchTime;

    if (isNaN(lastWatchTime)) {
      res.status(403).send({ message: "Last watch time is not a number" });
      return;
    }

    const requestedVideoId = req.query.videoId;

    await User.findOneAndUpdate(
      { username: username, "videos.video.id": requestedVideoId },
      { $set: { "videos.$.video.lastWatchTime": Math.floor(lastWatchTime) } }
    );

    res.status(200).send({ message: "Updated last watch time" });
    return;
  } catch (error) {
    console.log("Error in updateLastTime API endpoint: ", error.message);
    res.status(200).send({ message: "Something went wrong" });
    return;
  }
};

export default withAuth(withDbConnection(handler));
