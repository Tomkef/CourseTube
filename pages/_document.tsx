import Document, { Html, Head, Main, NextScript } from "next/document";
import { Global } from "@mantine/core";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />

          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="keywords"
            content="courses, youtube videos, coursify youtube videos, online learning, online studying, udemy experience"
          />
        </Head>
        <Global
          styles={(theme) => ({
            "html, body": {
              scrollBehavior: "smooth",
              padding: 0,
              margin: 0,
              fontFamily: `Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
            },

            a: {
              color: "inherit",
              textDecoration: "none",
            },

            "*": { boxSizing: "border-box" },
          })}
        />
        <body lang="en">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
