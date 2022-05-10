import { Fragment } from "react";

import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

import dynamic from "next/dynamic";
const ChaptersList = dynamic(() => import("components/CoursePage/Chapters"));
const Tabs = dynamic(() => import("components/CoursePage/Tabs"));

import Player from "components/CoursePage/Player";

import { Text, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useCourse from "hooks/useCourse";

export default function CoursePage() {
  const router = useRouter();

  const courseId: string = router.query.courseId as string;

  const {
    seekToLastWatchTime,
    handleNoteClick,
    handleChapterClick,
    updateNote,
    deleteNote,
    addNote,
    handleChaptersUpdates,
    setCurrentChapterByTime,
    toggleChapterViewed,
    video,
    chapters,
    notes,
    lastWatchTime,
    currentChapter,
    scrollAreaRef,
    chaptersRefs,
    playerRef,
  } = useCourse(courseId);

  const theme = useMantineTheme();

  const textColor =
    theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[9];

  const smallerThanMedium = useMediaQuery("(max-width: 992px)");

  return (
    <Fragment>
      <Head>
        <title>{`CourseTube${
          video && video?.title ? ` | ${video.title}` : ``
        }`}</title>
        <meta name="title" content="CourseTube: Course Page" />
        <meta name="description" content="Track your learning progress" />
      </Head>

      {video && chapters && notes && lastWatchTime !== null && (
        <main style={{ padding: "1.5rem", paddingBottom: 0 }}>
          <header style={{ paddingBottom: "1rem" }}>
            <Title order={1} color={textColor}>
              {video.title}
            </Title>
            <Text size="md">{`By ${video.channelTitle}`}</Text>
          </header>
          <main>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: smallerThanMedium ? "60vh" : "80vh",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Player
                videoId={video.id}
                chaptersLength={chapters.length}
                currentChapter={currentChapter}
                //setCurrentChapterByTime={setCurrentChapterByTime}
                handleChapterClick={handleChapterClick}
                ref={playerRef}
                handleChaptersUpdates={handleChaptersUpdates}
                seekToLastWatchTime={seekToLastWatchTime}
              />
              {!smallerThanMedium && (
                <section
                  style={{
                    width: "20vw",
                    height: "100%",
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                >
                  <ChaptersList
                    chapters={chapters}
                    currentChapter={currentChapter}
                    toggleChapterViewed={toggleChapterViewed}
                    scrollAreaRef={scrollAreaRef}
                    chaptersRefs={chaptersRefs}
                    handleChapterClick={handleChapterClick}
                  />
                </section>
              )}
            </div>
          </main>
          <Tabs
            description={video.description}
            chapters={chapters}
            currentChapter={currentChapter}
            toggleChapterViewed={toggleChapterViewed}
            notes={notes}
            addNote={addNote}
            deleteNote={deleteNote}
            updateNote={updateNote}
            handleChapterClick={handleChapterClick}
            handleNoteClick={handleNoteClick}
            scrollAreaRef={scrollAreaRef}
            chaptersRefs={chaptersRefs}
          />
        </main>
      )}
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  try {
    let session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        session,
      },
    };
  } catch (error) {
    console.log("Error in courseId getServerSideProps: ", error.message);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
