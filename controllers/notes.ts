import { NextApiRequest, NextApiResponse } from "next/types";
import NotesServices from "services/notes";

const NotesController = {
  post: async (req: NextApiRequest, res: NextApiResponse, username: string) => {
    try {
      const notes = req.body?.notes;
      const videoId = req.body?.videoId;

      if (!notes || notes === "") {
        throw new Error("Bad request - empty note content");
      }

      if (!videoId || videoId === "") {
        throw new Error("Bad request - empty video id");
      }

      await NotesServices.setNotes(username, videoId, notes);

      const updatedNotes = await NotesServices.getNotes(username, videoId);

      res
        .status(200)
        .send({ message: "Added new note successfully", result: updatedNotes });
      return;
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ message: "Error trying to add note" });
      return;
    }
  },
  delete: async (
    req: NextApiRequest,
    res: NextApiResponse,
    username: string
  ) => {
    try {
      const noteId: string = req.body?.noteId;
      const videoId: string = req.body?.videoId;
      if (!noteId) {
        throw new Error("Bad request - empty noteId");
      }

      if (!videoId || videoId === "") {
        throw new Error("Bad request - empty video id");
      }

      await NotesServices.deleteNote(username, videoId, noteId);

      const updatedNotes = await NotesServices.getNotes(username, videoId);

      res
        .status(200)
        .send({ message: "Note deleted successfully", result: updatedNotes });
      return;
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ message: "Error trying to delete note" });
      return;
    }
  },
  patch: async (
    req: NextApiRequest,
    res: NextApiResponse,
    username: string
  ) => {
    try {
      const noteId: string = req.body?.noteId;
      const noteContent: string = req.body?.noteContent;
      const videoId: string = req.body?.videoId;
      if (!noteId) {
        throw new Error("Bad request - empty noteId");
      }

      if (!noteContent || noteContent === "") {
        throw new Error("Bad request - empty note content");
      }

      if (!videoId || videoId === "") {
        throw new Error("Bad request - empty video id");
      }

      await NotesServices.updateNote(username, videoId, noteId, noteContent);

      const updatedNotes = await NotesServices.getNotes(username, videoId);

      res
        .status(200)
        .send({ message: "Note updated successfully", result: updatedNotes });
      return;
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ message: "Error trying to update note" });
      return;
    }
  },
};

export default NotesController;
