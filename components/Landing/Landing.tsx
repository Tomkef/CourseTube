import { useMantineTheme } from "@mantine/core";

import LandingSection from "components/Landing/LandingSection";
import Features from "components/Landing/Features";

import introImage from "../../public/intro.png";
import loginImage from "../../public/login.png";
import addCourseImage_light from "../../public/addCourse-Light.png";
import addCourseImage_dark from "../../public/addCourse-Dark.png";
import learnImage from "../../public/learn.png";

const Landing = () => {
  const theme = useMantineTheme();

  const isDarkTheme = theme.colorScheme === "dark";

  const backgroundColorOdd = isDarkTheme
    ? theme.colors.dark[7]
    : theme.colors.gray[1];

  const backgroundColorEven = isDarkTheme
    ? theme.colors.dark[9]
    : theme.colors.gray[0];

  return (
    <main>
      <LandingSection
        backgroundColor={backgroundColorOdd}
        isReverse={false}
        title="Track Youtube courses with ease!"
        text="Easily track your online self-learning"
        image={{
          file: introImage,
          width: 500,
          height: 500,
          href: "https://storyset.com/people",
          alt: "study",
          credit: "People illustrations by Storyset",
          priority: true,
        }}
      />

      <Features />

      <LandingSection
        backgroundColor={backgroundColorOdd}
        isReverse={true}
        title="Step 1"
        text="Sign in"
        image={{
          file: loginImage,
          width: 500,
          height: 500,
          href: "https://storyset.com/mobile",
          alt: "login",
          credit: "Mobile illustrations by Storyset",
        }}
      />

      <LandingSection
        backgroundColor={backgroundColorEven}
        isReverse={false}
        title="Step 2"
        text={`Add new course by entering its Youtube's URL`}
        image={{
          file: isDarkTheme ? addCourseImage_dark : addCourseImage_light,
          width: 695,
          height: 66,
          alt: "add course screenshot",
        }}
      />

      <LandingSection
        backgroundColor={backgroundColorOdd}
        isReverse={true}
        title="Step 3"
        text={`Start learning`}
        image={{
          file: learnImage,
          width: 500,
          height: 500,
          alt: "study progress",
          href: "https://storyset.com/work",
          credit: "Work illustrations by Storyset",
        }}
      />
    </main>
  );
};

export default Landing;
