import { useMemo, useState, useEffect, Fragment } from "react";
import {
  Paper,
  Text,
  Select,
  Textarea,
  Button,
  Group,
  Menu,
} from "@mantine/core";

import { useModals } from "@mantine/modals";
import { Chapter, Note } from "types";
import { TrashIcon, TextIcon } from "@modulz/radix-icons";
import mongoose from "mongoose";

type NotesProps = {
  chapters: Chapter[];
  notes: Note[];
  addNote: (noteContent: string) => Promise<boolean>;
  deleteNote: (noteId: mongoose.Types.ObjectId) => void;
  updateNote: (noteId: mongoose.Types.ObjectId, noteContent: string) => void;
  handleNoteClick: (chapterId: number, time: number) => void;
  currentChapter: number;
};

type selectChapterObjectType = {
  value: string;
  label: string;
};

const Notes: React.FC<NotesProps> = ({
  chapters,
  notes,
  addNote,
  deleteNote,
  updateNote,
  handleNoteClick,
  currentChapter,
}) => {
  const modals = useModals();
  const [selectedValue, setSelectedValue] = useState<string>("all");
  const [noteContent, setNoteContent] = useState<string>("");
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
  const [editedNoteId, setEditedNoteId] = useState<mongoose.Types.ObjectId>();
  const [editedNoteContent, setEditedNoteContent] = useState<string>("");

  const openDeleteModal = (noteId: mongoose.Types.ObjectId) => {
    modals.openConfirmModal({
      title: "Delete note",
      children: (
        <Text size="sm">
          {`Are you sure you want to delete this note?`}
          <br />
          {`All data will be lost.`}
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteNote(noteId),
      onCancel: () => {},
    });
  };

  const selectChapterObject: selectChapterObjectType[] = useMemo(() => {
    const newSelectedChapterObj = [{ value: "all", label: "Show All" }];
    chapters.forEach((chapter) => {
      newSelectedChapterObj.push({
        value: chapter.id.toString(),
        label: chapter.title,
      });
    });
    return newSelectedChapterObj;
  }, [chapters]);

  useEffect(() => {
    setCurrentNotes(
      notes.filter((note) => {
        if (selectedValue === "all") return true;
        else {
          return note.chapterId.toString() === selectedValue;
        }
      })
    );
  }, [selectedValue, notes]);

  useEffect(() => {
    if (currentChapter !== null) {
      setSelectedValue(currentChapter.toString());
    }
  }, [currentChapter]);

  const handleAddNote = async () => {
    const isSuccess = await addNote(noteContent);
    if (isSuccess) {
      setNoteContent("");
    }
  };

  const handleSaveChanges = () => {
    const noteId = editedNoteId;
    const noteContent = editedNoteContent;

    updateNote(noteId, noteContent);
    setEditedNoteId(null);
    setEditedNoteContent("");
  };

  return (
    <div style={{ padding: "1rem 1.5rem 0 1.5rem" }}>
      <span>Choose chapter to show its relevant notes</span>
      <Select
        placeholder="Pick chapter"
        radius="lg"
        style={{ width: "fit-content", paddingTop: "0.3rem" }}
        data={selectChapterObject}
        value={selectedValue}
        onChange={setSelectedValue}
      />
      {currentNotes.length === 0 && (
        <Text size="sm" style={{ margin: "1rem 0" }}>
          {selectedValue === "all"
            ? `You have no notes yet`
            : `Selected chapter has no notes`}
        </Text>
      )}
      {currentNotes.length > 0 &&
        currentNotes.map((note) => {
          return (
            <Paper
              key={note._id.toString()}
              padding="md"
              shadow="sm"
              radius="lg"
              style={{
                width: "fit-content",
                margin: "1rem 0",
                position: "relative",
              }}
            >
              <Text color="dimmed">
                {`${note.chapterTitle} (`}
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={() =>
                    handleNoteClick(note.chapterId, Math.round(note.time))
                  }
                >{`${note.timeString}`}</span>
                {`)`}
              </Text>
              {editedNoteId !== note._id && (
                <Fragment>
                  <Text>{note.content}</Text>
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 999,
                      padding: 5,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <Menu menuButtonLabel="Note Menu" radius={"md"}>
                      <Menu.Item
                        icon={<TextIcon />}
                        onClick={() => {
                          setEditedNoteId(note._id);
                          setEditedNoteContent(note.content);
                        }}
                        aria-label="Edit Note"
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        icon={<TrashIcon />}
                        aria-label="Delete Note"
                        onClick={() => {
                          openDeleteModal(note._id);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  </div>
                </Fragment>
              )}
              {editedNoteId === note._id && (
                <Fragment>
                  <Textarea
                    radius="lg"
                    value={editedNoteContent}
                    onChange={(event) =>
                      setEditedNoteContent(event.currentTarget.value)
                    }
                  />
                  <Group sx={{ marginTop: 10 }}>
                    <Button
                      size="sm"
                      radius="lg"
                      onClick={handleSaveChanges}
                      disabled={editedNoteContent === ""}
                    >
                      Save Changes
                    </Button>
                    <Button
                      size="sm"
                      radius="lg"
                      variant="outline"
                      onClick={() => {
                        setEditedNoteId(null);
                      }}
                    >
                      Abort Changes
                    </Button>
                  </Group>
                </Fragment>
              )}
            </Paper>
          );
        })}
      <Textarea
        placeholder="Your new note"
        label="Add note"
        radius="lg"
        required
        value={noteContent}
        onChange={(event) => setNoteContent(event.currentTarget.value)}
      />
      <Group sx={{ marginTop: 10 }}>
        <Button
          size="sm"
          radius="lg"
          onClick={handleAddNote}
          disabled={noteContent === ""}
        >
          Save
        </Button>
        <Button
          size="sm"
          radius="lg"
          variant="outline"
          onClick={() => {
            setNoteContent("");
          }}
          disabled={noteContent === ""}
        >
          Clear
        </Button>
      </Group>
    </div>
  );
};

export default Notes;
