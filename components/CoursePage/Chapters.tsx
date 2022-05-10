import { Text, ScrollArea, Paper, createStyles, Tooltip } from "@mantine/core";
import { CheckCircledIcon } from "@modulz/radix-icons";
import { Chapter } from "types";
import { ForwardedRef, RefObject } from "react";

const useStyles = createStyles((theme) => ({
  chapterTile: {
    width: "92%",
    margin: "0.6rem auto",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.02, 1.02)",
    },
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      width: "95%",
      margin: "1rem auto",
    },
  },
  currentChapterTile: {
    background:
      theme.colorScheme === "dark"
        ? theme.fn.linearGradient(
            240,
            theme.colors.blue[7],
            theme.colors.blue[9]
          )
        : theme.fn.linearGradient(
            240,
            theme.colors.blue[3],
            theme.colors.blue[4]
          ),
  },
  chapterIcon: {
    flex: "0 0 2rem",
    alignSelf: "center",
    marginRight: "1rem",
  },
  viewedIcon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.teal[3]
        : theme.colors.teal[8],
  },
  unviewedIcon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[5],
  },
  scrollArea: {
    height: "100%",
    paddingRight: "1rem",
    paddingLeft: "0.3rem",
  },
}));

const ChaptersList = ({
  chapters,
  currentChapter,
  toggleChapterViewed,
  scrollAreaRef,
  chaptersRefs,
  handleChapterClick,
}: {
  chapters: Chapter[];
  currentChapter: number;
  toggleChapterViewed: (chapterId: number) => void;
  scrollAreaRef: ForwardedRef<HTMLDivElement>;
  chaptersRefs: RefObject<HTMLDivElement[] | null[]>;
  handleChapterClick: (chapterId: number) => void;
}) => {
  const { classes } = useStyles();

  return (
    <ScrollArea
      className={classes.scrollArea}
      type="always"
      viewportRef={scrollAreaRef}
    >
      {chapters.map((chapter) => {
        return (
          <Paper
            padding="md"
            shadow="sm"
            radius="lg"
            className={`${classes.chapterTile}${
              currentChapter === chapter.id
                ? ` ${classes.currentChapterTile}`
                : ``
            }`}
            onClick={() => handleChapterClick(chapter.id)}
            ref={(element: HTMLDivElement) =>
              (chaptersRefs.current[chapter.id] = element)
            }
            key={chapter.id}
          >
            <Tooltip
              wrapLines
              withArrow
              transition="fade"
              transitionDuration={200}
              label={`Click to mark as ${
                chapter.viewed ? "unviewed" : "viewed"
              }`}
              className={classes.chapterIcon}
            >
              <CheckCircledIcon
                className={
                  chapter.viewed ? classes.viewedIcon : classes.unviewedIcon
                }
                onClick={(event) => {
                  event.stopPropagation();
                  toggleChapterViewed(chapter.id);
                }}
                width={"1.7rem"}
                height={"1.7rem"}
              />
            </Tooltip>

            <section>
              <Text size="sm" weight={500}>
                {chapter.title}
              </Text>
              <Text size="xs">{`${Math.round(
                chapter.duration / 60
              )} min`}</Text>
            </section>
          </Paper>
        );
      })}
    </ScrollArea>
  );
};

ChaptersList.displayName = "ChaptersList";

export default ChaptersList;
