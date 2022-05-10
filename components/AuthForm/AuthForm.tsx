import {
  useState,
  useRef,
  Fragment,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Title,
  Text,
  useMantineTheme,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import Head from "next/head";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";

import {
  showErrorNotification,
  showSuccessNotification,
} from "utils/notifications";
import { useNotifications } from "@mantine/notifications";

import { loginSchema, registerSchema } from "utils/validations";
import FormInput from "components/AuthForm/FormInput";

function AuthForm() {
  const notifications = useNotifications();
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const theme = useMantineTheme();

  const usernameInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();
  const emailInputRef = useRef<HTMLInputElement>();

  const [errors, setErrors] = useState<{
    email: string;
    username: string;
    password: string;
  }>({ email: null, username: null, password: null });

  const [signinError, setSigninError] = useState<boolean>(false);

  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(false);

  const toggleFormMode = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleLoginWithDemoUser = async () => {
    try {
      setShowLoadingOverlay(true);
      const result = await signIn("credentials", {
        redirect: false,
        username: "demo",
        password: "1234567",
      });

      if (!result.error) {
        router.replace("/courses");
        return;
      } else {
        setSigninError(true);
        setErrors({
          username: null,
          email: null,
          password: null,
        });
        setShowLoadingOverlay(false);
      }
    } catch (error) {
      setSigninError(true);
    }
  };

  const handleLogin = useCallback(async () => {
    try {
      const enteredUsername = usernameInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;
      await loginSchema.validate(
        {
          username: enteredUsername,
          password: enteredPassword,
        },
        { abortEarly: false }
      );
      const result = await signIn("credentials", {
        redirect: false,
        username: enteredUsername,
        password: enteredPassword,
      });

      if (!result.error) {
        router.replace("/courses");
        return;
      } else {
        setSigninError(true);
        setErrors({
          username: null,
          email: null,
          password: null,
        });
        setShowLoadingOverlay(false);
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        setSigninError(false);
        const newErrorsObject = {
          username: null,
          email: null,
          password: null,
        };
        error.inner.forEach((currentError) => {
          newErrorsObject[currentError.path] = currentError.message;
        });
        setErrors(newErrorsObject);
      } else {
        setSigninError(true);
      }
      setShowLoadingOverlay(false);
    }
  }, [router]);

  const handleRegister = async () => {
    try {
      const enteredUsername = usernameInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;
      const enteredEmail = emailInputRef.current.value;

      await registerSchema.validate(
        {
          username: enteredUsername,
          password: enteredPassword,
          email: enteredEmail,
        },
        { abortEarly: false }
      );

      await axios.post("/api/auth/signup", {
        username: enteredUsername,
        password: enteredPassword,
        email: enteredEmail,
      });

      showSuccessNotification({
        notifications,
        title: "Registered successfully!",
        message: "Now you can login to your account",
      });
      toggleFormMode();
      setShowLoadingOverlay(false);
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrorsObject = {
          username: null,
          email: null,
          password: null,
        };
        error.inner.forEach((currentError) => {
          newErrorsObject[currentError.path] = currentError.message;
        });
        setErrors(newErrorsObject);
        setShowLoadingOverlay(false);
      } else if (error.isAxiosError) {
        const newErrorsObject = {
          username: null,
          email: null,
          password: null,
        };
        error.response.data.forEach((currentError) => {
          newErrorsObject[currentError.inputField] = currentError.errorMessage;
        });
        setErrors(newErrorsObject);
        setShowLoadingOverlay(false);
      } else {
        showErrorNotification({
          notifications,
          message: "Something went wrong",
        });
        setShowLoadingOverlay(false);
      }
    }
  };

  useEffect(() => {
    setErrors({ email: null, username: null, password: null });
    usernameInputRef.current.value = "";
    passwordInputRef.current.value = "";
    if (!isLogin) {
      setSigninError(false);
      emailInputRef.current.value = "";
    }
  }, [isLogin]);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowLoadingOverlay(true);
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{`CourseTube | ${isLogin ? "Login" : "Signup"}`}</title>
        <meta name="title" content={`${isLogin ? "Login" : "Signup"} Page`} />
        <meta
          name="description"
          content={`${
            isLogin ? "Login to your account" : "Create new account"
          } Page`}
        />
      </Head>

      <LoadingOverlay visible={showLoadingOverlay} />

      <main
        style={{
          paddingLeft: "auto",
          paddingRight: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: 30,
          paddingBottom: 30,
          width: isSmallScreen ? "80%" : "40%",
        }}
      >
        <section>
          <header style={{ paddingBottom: "1rem" }}>
            <Title
              order={1}
              style={{
                color:
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 8
                  ],
                textAlign: "center",
              }}
            >
              {isLogin ? "Login" : "Register"}
            </Title>
          </header>

          <form onSubmit={submitHandler}>
            {!isLogin && (
              <FormInput
                error={errors.email}
                inputRef={emailInputRef}
                id="input-email"
                placeHolder="Your email"
                label="Email"
                type="email"
                description="Needed for password reset"
              />
            )}

            <FormInput
              error={errors.username}
              inputRef={usernameInputRef}
              id="input-username"
              placeHolder="Your username"
              label="Username"
              type="text"
            />

            <FormInput
              error={errors.password}
              inputRef={passwordInputRef}
              id="input-password"
              placeHolder="Your password"
              label="Password"
              type="password"
            />

            {isLogin && signinError && (
              <Text color={"red"}>Wrong username or password</Text>
            )}
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                size="md"
                type="submit"
                sx={{
                  backgroundColor: theme.colors[theme.primaryColor][8],
                }}
              >
                {isLogin ? "Login" : "Create User"}
              </Button>

              <Button
                size="md"
                variant="subtle"
                sx={{
                  marginTop: "1rem",
                  border: "none",
                  padding: "0.15rem 1.5rem",
                  color:
                    theme.colors[theme.primaryColor][
                      theme.colorScheme === "dark" ? 4 : 8
                    ],
                  "&:hover": {
                    backgroundColor: "transparent",
                    color:
                      theme.colors[theme.primaryColor][
                        theme.colorScheme === "dark" ? 8 : 4
                      ],
                  },
                }}
                onClick={toggleFormMode}
              >
                {isLogin
                  ? "Not registered yet? create new user"
                  : "Already registered? login with existing user"}
              </Button>
              <Text weight="bold">Or</Text>
              <Button
                size="md"
                variant="subtle"
                sx={{
                  border: "none",
                  color:
                    theme.colors[theme.primaryColor][
                      theme.colorScheme === "dark" ? 4 : 8
                    ],
                  "&:hover": {
                    backgroundColor: "transparent",
                    color:
                      theme.colors[theme.primaryColor][
                        theme.colorScheme === "dark" ? 8 : 4
                      ],
                  },
                }}
                onClick={handleLoginWithDemoUser}
              >
                {"Login with demo user"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </Fragment>
  );
}

export default AuthForm;
