import {
  Text,
  Select,
  Group,
  ThemeIcon,
  Tooltip,
  TextInput,
  Accordion,
} from "@mantine/core";
import CoursesList from "components/Courses/CoursesList";
import { useMediaQuery } from "@mantine/hooks";
import useAxios from "hooks/useAxios";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import {
  showErrorNotification,
  showSuccessNotification,
} from "utils/notifications";
import {
  API_USER_COURSES,
  deleteCourseFromUserInDB,
} from "utils/DB/clientSide";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Id, List, Search } from "tabler-icons-react";
import useFilterAndSort from "hooks/useFilterAndSort";
import SortsAndFilters from "./SortsAndFilters";

function MyCourses() {
  const notifications = useNotifications();
  const modals = useModals();

  const [listViewType, setListViewType] = useState<"Cards" | "Rows">("Cards");

  const {
    data: filteredAndSortedCourses,
    setAllData: setUserCourses,
    sortByValue,
    setSortByValue,
    filterByValue,
    setFilterByValue,
    searchValue,
    setSearchValue,
  } = useFilterAndSort();

  const {
    data: {
      message: userCoursesMessage,
      status: userCoursesStatus,
      result: userCoursesResult,
    },
    fetchData: getUserCoursesData,
  } = useAxios();

  const isSmallerThanMedium = useMediaQuery("(max-width: 992px)");

  const handleDeleteCourse = useCallback(
    async (videoId: string) => {
      const result = await deleteCourseFromUserInDB(videoId);

      if (result.status === "Success") {
        setUserCourses((prevCourses) => {
          const newCourses = [...prevCourses].filter(
            (course) => course.video.id !== videoId
          );
          return newCourses;
        });

        showSuccessNotification({
          notifications,
          message: result.message,
        });
      } else {
        showErrorNotification({ notifications, message: result.message });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const openDeleteModal = useCallback(
    (videoId: string) => {
      modals.openConfirmModal({
        title: "Delete course",
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this course?`}
            <br />
            {`All data will be lost.`}
          </Text>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: () => handleDeleteCourse(videoId),
        onCancel: () => {},
      });
    },
    [handleDeleteCourse, modals]
  );

  useEffect(() => {
    if (userCoursesStatus === "Error") {
      showErrorNotification({ notifications, message: userCoursesMessage });
    } else if (userCoursesStatus === "Success") {
      setUserCourses(userCoursesResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCoursesStatus]);

  useEffect(() => {
    getUserCoursesData({ url: API_USER_COURSES, method: "GET" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <section
        style={{
          paddingBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {isSmallerThanMedium && (
          <Accordion>
            <Accordion.Item label="Filters">
              <SortsAndFilters
                sortByValue={sortByValue}
                setSortByValue={setSortByValue}
                filterByValue={filterByValue}
                setFilterByValue={setFilterByValue}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            </Accordion.Item>
          </Accordion>
        )}
        {!isSmallerThanMedium && (
          <SortsAndFilters
            sortByValue={sortByValue}
            setSortByValue={setSortByValue}
            filterByValue={filterByValue}
            setFilterByValue={setFilterByValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        )}
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: isSmallerThanMedium ? "flex-start" : "flex-end",
            paddingTop: isSmallerThanMedium ? 5 : 0,
          }}
        >
          <Tooltip
            wrapLines
            withArrow
            transition="fade"
            transitionDuration={200}
            label="List"
          >
            <ThemeIcon
              size="xl"
              variant={listViewType === "Rows" ? "filled" : "light"}
              radius="md"
              onClick={() => setListViewType("Rows")}
              style={{ cursor: "pointer" }}
            >
              <List size={20} />
            </ThemeIcon>
          </Tooltip>
          <Tooltip
            wrapLines
            withArrow
            transition="fade"
            transitionDuration={200}
            label="Cards"
          >
            <ThemeIcon
              size="xl"
              variant={listViewType === "Cards" ? "filled" : "light"}
              radius="md"
              onClick={() => setListViewType("Cards")}
              style={{ cursor: "pointer" }}
            >
              <Id size={20} />
            </ThemeIcon>
          </Tooltip>
        </div>
      </section>

      <CoursesList
        courses={filteredAndSortedCourses}
        isSmallerThanMedium={isSmallerThanMedium}
        openDeleteModal={openDeleteModal}
        isUserCourse={true}
        viewType={listViewType}
        loadingStatus={userCoursesStatus}
      />
    </Fragment>
  );
}

export default MyCourses;
