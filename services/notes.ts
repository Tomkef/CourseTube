import { User } from "models/user";
import { Note } from "types";

const NotesServices = {
  setNotes: async (username: string, videoId: string, notes: Note[]) => {
    const updatedCourseObject = await User.findOneAndUpdate(
      { username: username, "videos.video.id": videoId },
      { $set: { "videos.$.notes": notes } },
      { projection: { "videos.$": 1 } }
    );

    if (!updatedCourseObject) {
      throw new Error(
        `Couldn't find user in DB / Couldn't find videoId in user's videos (while trying to update notes)`
      );
    }
  },

  getNotes: async (username: string, videoId: string) => {
    const userCourseArray = await User.findOne(
      {
        username: username,
        "videos.video.id": videoId,
      },
      { "videos.$": true }
    );

    const notes: Note[] = userCourseArray?.videos[0]?.notes;

    if (!notes) {
      throw new Error("Problem getting notes");
    }

    return notes;
  },

  deleteNote: async (username: string, videoId: string, noteId: string) => {
    await User.findOneAndUpdate(
      { username, "videos.video.id": videoId },
      { $pull: { "videos.$.notes": { _id: noteId } } },
      { projection: { "videos.$": true } }
    );
  },

  updateNote: async (
    username: string,
    videoId: string,
    noteId: string,
    noteContent: string
  ) => {
    await User.findOneAndUpdate(
      { username: username, "videos.video.id": videoId },
      { $set: { "videos.$.notes.$[note].content": noteContent } },
      {
        arrayFilters: [{ "note._id": noteId }],
      }
    );
  },
};

export default NotesServices;
