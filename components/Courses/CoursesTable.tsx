import { Group, LoadingOverlay, ScrollArea, Table } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { Fragment, useState, MouseEvent } from "react";
import { Share, Trash } from "tabler-icons-react";
import { AllCourses, Video } from "types";
import { showSuccessNotification } from "utils/notifications";
import secondsToTimeString from "utils/secondsToTimeString";

const CoursesTable = ({ courses, openDeleteModal }) => {
  const router = useRouter();

  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(false);

  const clipboard = useClipboard({ timeout: 500 });

  const notifications = useNotifications();

  const onRowClick = (courseId: string) => {
    setShowLoadingOverlay(true);
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}${courseId}`);
  };

  const handleDeleteCourseClick = (event: MouseEvent<SVGElement>, courseId) => {
    event.stopPropagation();
    openDeleteModal(courseId);
  };

  const handleShareCourseClick = (
    event: MouseEvent<SVGElement>,
    courseId: string
  ) => {
    event.stopPropagation();
    clipboard.copy(`http://www.youtube.com/watch?v=${courseId}`);
    showSuccessNotification({
      notifications,
      title: "Copied course link",
      message: "Share it with other users",
    });
  };

  const tableBody = courses.map((course: { video: Video } | AllCourses) => (
    <tr
      key={course.video.id}
      onClick={() => onRowClick(course.video.id)}
      style={{ cursor: "pointer" }}
    >
      <td>{course.video.title}</td>
      <td>{course.video.channelTitle}</td>
      <td>{secondsToTimeString(course.video.duration)}</td>
      <td>{`${course.video.completedPercent}%`}</td>
      <td>
        <Group>
          <Share
            onClick={(event) => handleShareCourseClick(event, course.video.id)}
          />
          <Trash
            onClick={(event) => handleDeleteCourseClick(event, course.video.id)}
          />
        </Group>
      </td>
    </tr>
  ));

  console.log(tableBody);

  return (
    <Fragment>
      <LoadingOverlay visible={showLoadingOverlay} />
      <ScrollArea style={{ width: "100%" }}>
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Channel</th>
              <th>Duration</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{tableBody}</tbody>
        </Table>
      </ScrollArea>
    </Fragment>
  );
};

export default CoursesTable;
