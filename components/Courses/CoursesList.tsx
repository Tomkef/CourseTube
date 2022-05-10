import { AllCourses, Video } from "types";
import CourseCard from "components/Courses/CourseCard";
import CoursesListSkeleton from "./CoursesListSkeleton";
import { Text } from "@mantine/core";
import Image from "next/image";
import CoursesTable from "components/Courses/CoursesTable";
import { Fragment } from "react";

const CoursesList = ({
  courses,
  isSmallerThanMedium,
  openDeleteModal,
  isUserCourse,
  viewType,
  loadingStatus,
}: {
  courses: { video: Video }[] | AllCourses[];
  isSmallerThanMedium: boolean;
  openDeleteModal?: (videoId: string) => void;
  isUserCourse: boolean;
  viewType: "Cards" | "Rows";
  loadingStatus: "Pending" | "Idle" | "Error" | "Success";
}) => {
  const isLoadingCourses =
    loadingStatus === "Pending" || loadingStatus === "Idle";

  const isCourses =
    loadingStatus === "Success" && courses && courses.length > 0;

  const isNoCourses =
    loadingStatus === "Success" && courses && courses.length === 0;

  const isError = loadingStatus === "Error";

  return (
    <section
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: isSmallerThanMedium ? "column" : "row",
        justifyContent: "space-around",
        alignContent: "center",
      }}
    >
      {isLoadingCourses && (
        <CoursesListSkeleton
          isSmallerThanMedium={isSmallerThanMedium}
          isUserList={isUserCourse}
          viewType={viewType}
        />
      )}

      {isError && (
        <Text
          sx={{
            textAlign: "center",
            paddingTop: "1.5rem",
            paddingBottom: "1rem",
          }}
        >
          Something went wrong
        </Text>
      )}

      {isCourses &&
        viewType === "Cards" &&
        courses.map((course: { video: Video } | AllCourses) => {
          return (
            <CourseCard
              key={course.video.id}
              id={course.video.id}
              title={course.video.title}
              description={course.video.description}
              channelTitle={course.video.channelTitle}
              completedPercent={course.video.completedPercent}
              isUserVideo={isUserCourse}
              openDeleteModal={openDeleteModal}
            />
          );
        })}

      {isCourses && viewType === "Rows" && (
        <CoursesTable courses={courses} openDeleteModal={openDeleteModal} />
      )}

      {isNoCourses && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          <Image
            src={`/noData.svg`}
            priority={true}
            alt="no courses"
            width={300}
            height={300}
          />
          <Text
            sx={(theme) => ({
              textAlign: "center",
              marginBottom: 25,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.colors.gray[9],
            })}
          >
            {isUserCourse && (
              <Fragment>
                {`You don't have any courses yet!`}
                <br />
                {`Add new course in the input above or choose a course from the other courses tab.`}
              </Fragment>
            )}
            {!isUserCourse && (
              <Fragment>
                {`There are no other courses.`}
                <br />
                {`Be the first to add a course!`}
              </Fragment>
            )}
          </Text>
        </div>
      )}
    </section>
  );
};

export default CoursesList;
