import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    padding: "1.2rem",
    borderTop: "1px solid #eaeaea",
    textAlign: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[1]
        : theme.colors.dark[9],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[9]
        : theme.colors.gray[1],

    width: "100%",
  },
  /*
  link: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },*/
}));

const Footer = () => {
  const { classes } = useStyles();

  return (
    <footer className={classes.footer}>
      Created by <strong>Tom Kaufman</strong>
    </footer>
  );
};

export default Footer;
