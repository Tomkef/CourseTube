import {
  Title,
  ActionIcon,
  Header as MantineHeader,
  Button,
  Box,
} from "@mantine/core";
import { SunIcon, MoonIcon } from "@modulz/radix-icons";

import { signOut, useSession } from "next-auth/react";
import { useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { Login, Logout } from "tabler-icons-react";

import { useRouter } from "next/router";
import { useNotifications } from "@mantine/notifications";
import { showErrorNotification } from "utils/notifications";

const Navbar = ({ toggleColorScheme /*, session */ }) => {
  const theme = useMantineTheme();

  const notifications = useNotifications();

  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {},
  });

  return (
    <MantineHeader
      height={70}
      padding="md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "flex-start",
        }}
        sx={{
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}`}>
          <a style={{ alignSelf: "center" }}>
            <Title
              order={3}
              style={{ alignSelf: "center", marginTop: 0, marginBottom: 0 }}
            >
              CourseTube
            </Title>
          </a>
        </Link>
        {session && (
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}courses`}>
            <a
              style={{
                marginLeft: "1rem",
              }}
            >
              <Button
                variant="subtle"
                style={{
                  paddingRight: "0.3rem",
                  paddingLeft: "0.3rem",
                  color:
                    theme.colors[theme.primaryColor][
                      theme.colorScheme === "dark" ? 4 : 8
                    ],
                }}
                aria-label="My Courses"
                name="My Courses"
              >
                My Courses
              </Button>
            </a>
          </Link>
        )}
      </Box>

      <section
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "flex-start",
        }}
      >
        {!session && (
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}auth`}>
            <a>
              <Button
                variant="light"
                name="Login"
                aria-label="Login"
                style={{
                  height: 28,
                  marginRight: "1rem",
                  paddingLeft: "0.6rem",
                  paddingRight: "0.6rem",
                }}
              >
                <Login />
              </Button>
            </a>
          </Link>
        )}
        {session && (
          <Button
            variant="light"
            aria-label="Logout"
            name="Logout"
            style={{
              height: 28,
              marginRight: "1rem",
              paddingLeft: "0.6rem",
              paddingRight: "0.6rem",
            }}
            onClick={async () => {
              const signOutResult = await signOut({
                redirect: false,
              });
              if (signOutResult) {
                router.replace(process.env.NEXT_PUBLIC_BASE_URL);
              } else {
                showErrorNotification({
                  notifications,
                  message: `Error while trying to log you out`,
                });
              }
            }}
          >
            <Logout />
          </Button>
        )}
        <ActionIcon
          variant="outline"
          name="Toggle Color Mode"
          aria-label="Toggle Color Mode"
          style={{
            color:
              theme.colorScheme === "dark"
                ? "yellow"
                : theme.colors[theme.primaryColor][8],
          }}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {theme.colorScheme === "dark" ? (
            <SunIcon style={{ width: 18, height: 18 }} />
          ) : (
            <MoonIcon style={{ width: 18, height: 18 }} />
          )}
        </ActionIcon>
      </section>
    </MantineHeader>
  );
};

export default Navbar;
