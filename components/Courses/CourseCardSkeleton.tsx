import { Card, createStyles, Skeleton } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    width: "300px",
    marginBottom: "2rem",
    marginLeft: 2,
    marginRight: 2,
    padding: 0,

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
}));

const CourseCardSkeleton = ({ isUserCard }: { isUserCard: boolean }) => {
  const { classes } = useStyles();
  return (
    <Card
      className={classes.card}
      sx={{ height: isUserCard ? "480px" : "420px" }}
    >
      <Skeleton
        animate={true}
        height="180px"
        width="100%"
        sx={{ marginBottom: 20 }}
      />
      <Skeleton
        animate={true}
        height="20px"
        width="80%"
        radius="lg"
        sx={{ marginBottom: 12, marginLeft: 20 }}
      />
      <Skeleton
        animate={true}
        height="15px"
        width="60%"
        radius="lg"
        sx={{ marginBottom: 17, marginLeft: 20 }}
      />
      <Skeleton
        animate={true}
        height="12px"
        width="85%"
        radius="lg"
        sx={{ marginBottom: 10, marginLeft: 20 }}
      />
      <Skeleton
        animate={true}
        height="12px"
        width="85%"
        radius="lg"
        sx={{ marginBottom: 10, marginLeft: 20 }}
      />
      <Skeleton
        animate={true}
        height="12px"
        width="85%"
        radius="lg"
        sx={{ marginBottom: 10, marginLeft: 20 }}
      />
      <Skeleton
        animate={true}
        height="12px"
        width="85%"
        radius="lg"
        sx={{ marginBottom: 20, marginLeft: 20 }}
      />
      <Skeleton
        animate={true}
        height="20px"
        width="85%"
        radius="lg"
        sx={{ marginBottom: 10, marginLeft: 20 }}
      />
      <Skeleton
        animate={true}
        height="15px"
        width="30%"
        radius="lg"
        sx={{ marginBottom: 10, marginLeft: 20 }}
      />
    </Card>
  );
};

export default CourseCardSkeleton;
