import { useState, Fragment } from "react";

import Head from "next/head";

import { getSession } from "next-auth/react";

import { SegmentedControl } from "@mantine/core";

import dynamic from "next/dynamic";
const AddCourse = dynamic(() => import("components/Courses/AddCourse"), {
  ssr: false,
});
const OtherCourses = dynamic(() => import("components/Courses/OtherCourses"), {
  ssr: false,
});

//import AddCourse from "components/AddCourse";

import MyCourses from "components/Courses/MyCourses";

export default function CoursesPage() {
  const [currentTab, setCurrentTab] = useState("myCourses");

  return (
    <Fragment>
      <Head>
        <title>CourseTube | My Courses</title>
        <meta name="title" content="CourseTube: My Courses" />
        <meta
          name="description"
          content={`View your courses and other users' recently added courses`}
        />
      </Head>

      <main
        style={{
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 30,
          paddingBottom: 30,
        }}
      >
        <AddCourse />

        <SegmentedControl
          value={currentTab}
          onChange={setCurrentTab}
          fullWidth
          transitionDuration={500}
          transitionTimingFunction="linear"
          data={[
            { label: "My Courses", value: "myCourses" },
            { label: "Other Users' Courses", value: "otherCourses" },
          ]}
          style={{ marginBottom: "2rem" }}
        />

        {currentTab === "myCourses" && <MyCourses />}

        {currentTab === "otherCourses" && <OtherCourses />}
      </main>
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
    console.log("ERROR: ", error.message);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
