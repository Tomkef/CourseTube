import Image from "next/image";
import {
  Card,
  Text,
  Progress,
  Menu,
  createStyles,
  LoadingOverlay,
} from "@mantine/core";
import { Fragment, useState } from "react";

import { useClipboard } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";

import { TrashIcon, Share1Icon, PlusIcon } from "@modulz/radix-icons";
import { useRouter } from "next/router";
import { showSuccessNotification } from "utils/notifications";

type courseCardProps = {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  completedPercent: number;
  isUserVideo: boolean | null;
  openDeleteModal?: (videoId: string) => void;
};

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    cursor: "pointer",
    width: "300px",
    height: "480px",
    marginBottom: "2rem",
    marginLeft: 2,
    marginRight: 2,
    "&:hover": {
      transform: "scale(1.02, 1.02)",
    },
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  menu: {
    position: "absolute",
    zIndex: 999,
    padding: 5,
    right: 0,
    bottom: 0,
  },
  progress: {
    marginTop: 15,
    marginBottom: 4,
  },
  text: {
    paddingTop: "0.5rem",
  },
}));
const CourseCard = ({
  id,
  title,
  description,
  channelTitle,
  completedPercent,
  isUserVideo = false,
  openDeleteModal,
}: courseCardProps) => {
  const router = useRouter();

  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(false);

  const { classes } = useStyles();

  const clipboard = useClipboard({ timeout: 500 });

  const notifications = useNotifications();

  const onCardClick = () => {
    setShowLoadingOverlay(true);
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}${id}`);
  };

  const handleShareButtonClick = () => {
    clipboard.copy(`https://www.youtube.com/watch?v=${id}`);
    showSuccessNotification({
      notifications,
      title: "Copied course link",
      message: "Share it with other users",
    });
  };

  return (
    <Fragment>
      <LoadingOverlay visible={showLoadingOverlay} />
      <Card
        className={classes.card}
        shadow="sm"
        padding="xl"
        component="a"
        radius="md"
        onClick={onCardClick}
        sx={{ height: isUserVideo ? "480px" : "420px" }}
        aria-label="Navigate to course's page"
        role="button"
      >
        <Card.Section>
          <Image
            src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
            height={"180px"}
            width={"320px"}
            alt="Course Thumbnail"
          />
        </Card.Section>

        <Text weight={500} size="lg" className={classes.text}>
          {`${title.slice(0, 60)}${title.length > 60 ? "..." : ""}`}
          <Text size="sm">{`By ${channelTitle}`}</Text>
        </Text>

        <Text size="sm" className={classes.text}>{`${description.substring(
          0,
          120
        )}...`}</Text>
        {isUserVideo && (
          <Fragment>
            <Progress
              value={completedPercent}
              className={classes.progress}
              aria-label="Course Progress"
            />
            <Text
              style={{ paddingBottom: 7 }}
            >{`${completedPercent}% Completed`}</Text>
            <div className={classes.menu}>
              <Menu
                onClick={(e) => e.stopPropagation()}
                menuButtonLabel="Course Menu"
              >
                {/*}
                <Menu.Item
                  icon={<PlusIcon />}
                  onClick={handleShareButtonClick}
                  aria-label="Share Course"
                >
                  Add To List
                </Menu.Item>
        {*/}
                <Menu.Item
                  icon={<Share1Icon />}
                  onClick={handleShareButtonClick}
                  aria-label="Share Course"
                >
                  Share
                </Menu.Item>
                <Menu.Item
                  color="red"
                  icon={<TrashIcon />}
                  aria-label="Delete Course"
                  onClick={() => openDeleteModal(id)}
                >
                  Delete
                </Menu.Item>
              </Menu>
            </div>
          </Fragment>
        )}
      </Card>
    </Fragment>
  );
};

export default CourseCard;
