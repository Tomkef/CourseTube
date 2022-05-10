import Link from "next/link";

import { Text, Tabs as MantineTabs, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import dynamic from "next/dynamic";
const Notes = dynamic(() => import("components/CoursePage/Notes"));

import ChaptersList from "components/CoursePage/Chapters";
import { Chapter, Note } from "types";
import { ForwardedRef, RefObject, useMemo } from "react";
import mongoose from "mongoose";

const parseDescriptionLinks = (
  description: string
): (JSX.Element | string)[] => {
  let descriptionWordsArray: string[] = description
    .replaceAll("\n", " <br> ")
    .split(` `);

  let parsedDescription = descriptionWordsArray.map((word, index) => {
    let hasSpace = index !== descriptionWordsArray.length - 1;
    let maybeSpace = hasSpace ? " " : "";

    if (word.match(/^https\:\//)) {
      return (
        <Link key={index} href={word}>
          <a
            target="_blank"
            style={{ textDecoration: "underline" }}
          >{`${word}${maybeSpace}`}</a>
        </Link>
      );
    } else {
      if (word === "<br>") {
        return <br key={index} />;
      }
      return `${word}${maybeSpace}`;
    }
  });

  return parsedDescription;
};

type TabsProps = {
  description: string;
  chapters: Chapter[];
  currentChapter: number;
  toggleChapterViewed: (chapterId: number) => void;
  notes: Note[];
  addNote: (content: string) => Promise<boolean>;
  deleteNote: (noteId: mongoose.Types.ObjectId) => void;
  updateNote: (noteId: mongoose.Types.ObjectId, noteContent: string) => void;
  handleChapterClick: (chapterId: number) => void;
  handleNoteClick: (chapterId: number, time: number) => void;
  scrollAreaRef: ForwardedRef<HTMLDivElement>;
  chaptersRefs: RefObject<HTMLDivElement[] | null[]>;
};

const Tabs: React.FC<TabsProps> = ({
  description,
  chapters,
  currentChapter,
  toggleChapterViewed,
  notes,
  addNote,
  deleteNote,
  updateNote,
  handleChapterClick,
  handleNoteClick,
  scrollAreaRef,
  chaptersRefs,
}) => {
  const theme = useMantineTheme();
  const textColor =
    theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[9];

  const smallerThanMedium = useMediaQuery("(max-width: 992px)");

  let parsedDescription = useMemo(
    () => parseDescriptionLinks(description),
    [description]
  );

  return (
    <MantineTabs
      grow
      variant="outline"
      style={{ marginBottom: "30px", marginTop: "30px" }}
    >
      {smallerThanMedium && (
        <MantineTabs.Tab label="Chapters">
          <ChaptersList
            chapters={chapters}
            currentChapter={currentChapter}
            toggleChapterViewed={toggleChapterViewed}
            scrollAreaRef={scrollAreaRef}
            handleChapterClick={handleChapterClick}
            chaptersRefs={chaptersRefs}
          />
        </MantineTabs.Tab>
      )}
      <MantineTabs.Tab label="Description">
        <Text
          color={textColor}
          style={{
            padding: "1rem 1.5rem 0 1.5rem",
            overflowWrap: "break-word",
          }}
        >
          {parsedDescription}
        </Text>
      </MantineTabs.Tab>
      <MantineTabs.Tab label="Notes">
        <Notes
          chapters={chapters}
          currentChapter={currentChapter}
          notes={notes}
          addNote={addNote}
          deleteNote={deleteNote}
          updateNote={updateNote}
          handleNoteClick={handleNoteClick}
        />
      </MantineTabs.Tab>
    </MantineTabs>
  );
};

export default Tabs;
