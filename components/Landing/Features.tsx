import {
  Text,
  Container,
  ThemeIcon,
  Title,
  SimpleGrid,
  createStyles,
} from "@mantine/core";

import Image from "next/image";

import { useMediaQuery } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: "3rem",
    paddingBottom: "3.5rem",
    paddingLeft: "2rem",
    paddingRight: "2rem",
    overflowX: "hidden",
  },

  featureWrapper: {
    display: "flex",
  },

  description: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
  },

  featureIcon: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.md,
    overflow: "hidden",
  },

  featureTitle: {
    marginBottom: theme.spacing.xs / 2,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    fontWeight: 700,
  },

  sectionTitle: {
    textAlign: "center",
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 8],
  },
}));

const featuresData = [
  {
    image: "checklist",
    title: "Progress Tracking",
    description: `Automatically tracking of course's progress and viewed chapters so you can easily continue studying from where you left.`,
    src: "/checklist.svg",
  },
  {
    image: "notes",
    title: "Notes",
    description: `Write important notes while studying and easily come back to their point of time in the course.`,
    src: "/notes.svg",
  },
  {
    image: "free",
    title: "Free",
    description: `No Ads and no subscription fees.`,
    src: "/free.svg",
  },
  {
    image: "openSource",
    title: "Open Source",
    description: `The source code is available on Github.`,
    src: "/openSource.svg",
  },
];

export default function Features() {
  const { classes } = useStyles();

  const isSmallScreen = useMediaQuery("(max-width: 992px)");

  return (
    <Container size={700} className={classes.wrapper}>
      <Title className={classes.sectionTitle} order={isSmallScreen ? 2 : 1}>
        Features
      </Title>

      <SimpleGrid
        cols={2}
        spacing={50}
        breakpoints={[{ maxWidth: 550, cols: 1, spacing: 40 }]}
        style={{ marginTop: 30 }}
      >
        {featuresData.map((item) => (
          <div className={classes.featureWrapper} key={item.image}>
            <ThemeIcon
              variant="light"
              className={classes.featureIcon}
              size={80}
              radius="md"
            >
              <Image src={item.src} alt={item.title} width={60} height={60} />
            </ThemeIcon>

            <div>
              <Text size="lg" className={classes.featureTitle}>
                {item.title}
              </Text>
              <Text className={classes.description}>{item.description}</Text>
            </div>
          </div>
        ))}
      </SimpleGrid>
    </Container>
  );
}
