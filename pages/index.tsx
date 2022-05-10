import { Fragment } from "react";

import Head from "next/head";

import Landing from "components/Landing";

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>CourseTube</title>
        <meta name="title" content="CourseTube" />
        <meta name="description" content="Track Youtube courses" />
        <meta
          name="keywords"
          content="courses, youtube videos, coursify youtube videos, online learning, online studying, udemy experience"
        />
        <link rel="icon" href="/Logo.png" />
      </Head>

      <Landing />
    </Fragment>
  );
}
