import React, { forwardRef } from "react";
import ReactPlayer from "react-player/youtube";
import { createStyles } from "@mantine/core";
import { TrackPreviousIcon, TrackNextIcon } from "@modulz/radix-icons";
import { PlayerComponentProps } from "types";

const YOUTUBE_VIDEO_PREFIX_URL = `https://www.youtube.com/watch?v=`;

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  player: {
    display: "box",
    WebkitBorderRadius: "15px",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  playerArrows: {
    height: 25,
    width: 25,
    alignSelf: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    cursor: "pointer",
  },
}));

const Player = forwardRef<ReactPlayer, PlayerComponentProps>(
  (
    {
      videoId,
      chaptersLength,
      currentChapter,
      seekToLastWatchTime,
      //setCurrentChapterByTime,
      handleChapterClick,
      handleChaptersUpdates,
    },
    ref
  ) => {
    const { classes } = useStyles();

    return (
      <section className={classes.wrapper}>
        {currentChapter !== 0 && (
          <TrackPreviousIcon
            className={classes.playerArrows}
            onClick={() => {
              handleChapterClick(currentChapter - 1);
            }}
          />
        )}
        <ReactPlayer
          ref={ref}
          url={`${YOUTUBE_VIDEO_PREFIX_URL}${videoId}`}
          playing={true}
          //onPlay={setCurrentChapterByTime}
          progressInterval={5000}
          onProgress={handleChaptersUpdates}
          onReady={seekToLastWatchTime}
          width="100%"
          height="100%"
          crossOrigin="anonymous"
          config={{
            playerVars: {
              controls: 1,
            },
          }}
          className={classes.player}
        />

        {currentChapter !== chaptersLength - 1 && (
          <TrackNextIcon
            className={classes.playerArrows}
            onClick={() => {
              handleChapterClick(currentChapter + 1);
            }}
          />
        )}
      </section>
    );
  }
);

Player.displayName = "Player";

export default Player;
