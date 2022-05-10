import NotesController from "controllers/notes";
import withAuth from "middleware/withAuth";
import withDbConnection from "middleware/withDbConnection";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  username: string
) => {
  try {
    switch (req.method) {
      case "POST":
        await NotesController.post(req, res, username);
        break;
      case "DELETE":
        await NotesController.delete(req, res, username);
        break;
      case "PATCH":
        await NotesController.patch(req, res, username);
        break;
      default:
        res.status(400).send({ message: "Bad request method" });
        return;
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ message: "Something went wrong" });
    return;
  }
};

export default withAuth(withDbConnection(handler));
