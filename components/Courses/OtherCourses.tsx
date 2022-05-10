import { useNotifications } from "@mantine/notifications";
import useAxios from "hooks/useAxios";
import { useEffect } from "react";
import { API_COURSES } from "utils/DB/clientSide";
import { showErrorNotification } from "utils/notifications";

import Image from "next/image";

import { Text, useMantineTheme } from "@mantine/core";
import CoursesListSkeleton from "components/Courses/CoursesListSkeleton";
import CoursesList from "components/Courses/CoursesList";
import { useMediaQuery } from "@mantine/hooks";

const OtherCourses = () => {
  const notifications = useNotifications();
  const theme = useMantineTheme();

  const textColor =
    theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[9];

  const smallerThanMedium = useMediaQuery("(max-width: 992px)");

  const {
    data: {
      message: recentCoursesMessage,
      status: recentCoursesStatus,
      result: recentCoursesResult,
    },
    fetchData: getAllCoursesData,
  } = useAxios();

  useEffect(() => {
    if (recentCoursesStatus === "Error") {
      showErrorNotification({ notifications, message: recentCoursesMessage });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentCoursesStatus]);

  useEffect(() => {
    getAllCoursesData({ url: API_COURSES, method: "GET" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CoursesList
      courses={recentCoursesResult}
      isSmallerThanMedium={smallerThanMedium}
      isUserCourse={false}
      viewType="Cards"
      loadingStatus={recentCoursesStatus}
    />
  );
};

export default OtherCourses;
