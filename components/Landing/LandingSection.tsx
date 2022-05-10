import { Text, Title, createStyles } from "@mantine/core";
import Image from "next/image";

const useStyles = createStyles(
  (
    theme,
    {
      backgroundColor,
      isReverse,
    }: { backgroundColor: string; isReverse: boolean }
  ) => ({
    wrapper: {
      display: "flex",
      flexDirection: isReverse ? "row-reverse" : "row",
      justifyContent: "space-evenly",
      alignContent: "center",
      padding: "10rem",
      overflowX: "hidden",
      backgroundColor,
      [`@media (max-width: ${theme.breakpoints.md}px)`]: {
        flexDirection: "column",
        padding: "2rem",
        marginBottom: 0,
      },
    },

    textWrapper: {
      textAlign: "center",
      alignSelf: "center",
    },

    imageWrapper: {
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
    },

    title: {
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 8],
    },
  })
);

type landingSectionProps = {
  backgroundColor: string;
  isReverse: boolean;
  title: string;
  text: string;

  image: {
    file: StaticImageData;
    href?: string;
    width: number;
    height: number;
    credit?: string;
    alt: string;
    priority?: boolean;
  };
};

const LandingSection: React.FC<landingSectionProps> = ({
  backgroundColor,
  isReverse,
  title,
  text,
  image,
}) => {
  const { classes } = useStyles({ backgroundColor, isReverse });

  return (
    <section className={classes.wrapper}>
      <div className={classes.textWrapper}>
        <Title className={classes.title} order={1}>
          {title}
        </Title>
        <Text size="xl">{text}</Text>
      </div>

      <div className={classes.imageWrapper}>
        <Image
          src={image.file}
          priority={image?.priority ? true : false}
          alt={image.alt}
          placeholder="blur"
          width={image.width}
          height={image.height}
        />
        {image?.href && (
          <a
            href={image.href}
            style={{
              textAlign: "center",
              fontSize: "0.5rem",
              paddingTop: "0.5rem",
            }}
          >
            {image.credit}
          </a>
        )}
      </div>
    </section>
  );
};

export default LandingSection;
