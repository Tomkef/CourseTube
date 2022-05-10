import { Fragment, useState } from "react";
import { AppShell, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import Head from "next/head";

import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("components/Layout/Navbar"));
const Footer = dynamic(() => import("components/Layout/Footer"));

import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  const toggleColorScheme = (value: "light" | "dark") =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <Fragment>
      <Head>
        <title>CourseTube</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider /*  session={pageProps.session} */>
        <MantineProvider
          withGlobalStyles
          // withNormalizeCSS
          theme={{
            colorScheme,
            fontFamily: `Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
            headings: {
              fontFamily: `Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
            },
          }}
        >
          <NotificationsProvider>
            <ModalsProvider>
              <AppShell
                padding="md"
                fixed
                header={
                  <Navbar
                    toggleColorScheme={toggleColorScheme}
                    {...pageProps}
                  />
                }
                styles={(theme) => ({
                  main: {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
                    padding: 0,
                  },
                })}
              >
                <Component {...pageProps} />
              </AppShell>
              <Footer />
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </Fragment>
  );
}

export default MyApp;
