import withDbConnection from "middleware/withDbConnection";

import { NextApiRequest, NextApiResponse } from "next";

import UsersServices from "services/users";
import { UsernameOrEmailInUse } from "types/errors";

import { hashPassword } from "utils/auth";
import getUsernameFromSession from "utils/getUsernameFromSession";
import { registerSchema } from "utils/validations";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const usernameFromSession = await getUsernameFromSession(req);
    const isUserAlreadyConnented = usernameFromSession !== null;

    const isBadRequest = req.method !== "POST" || isUserAlreadyConnented;

    if (isBadRequest) {
      res.status(400).send({ message: "Bad request" });
      return;
    }

    const {
      username,
      password,
      email,
    }: { username: string; password: string; email: string } = req.body;

    await registerSchema.validate(
      {
        username,
        password,
        email,
      },
      { abortEarly: false }
    );

    await handleCheckIfDetailsAlreadyExistInDB(username, email);

    const hashedPassword = await hashPassword(password);

    await UsersServices.create({ username, email, hashedPassword });

    res.status(201).send({ message: "Created user!" });
  } catch (error) {
    console.log("Error: ", { error });

    if (error.name === "ValidationError") {
      const errors: { inputField: string; errorMessage: string }[] = [];
      error.inner.forEach((currentError) => {
        errors.push({
          inputField: currentError.path,
          errorMessage: currentError.message,
        });
      });
      res.status(422).send(errors);
      return;
    }

    if (error.name === "UsernameOrEmailInUse") {
      res.status(422).send(error.errors);
      return;
    }

    res.status(500).send("Problem while trying to register.");
    return;
  }
}

export default withDbConnection(handler);

const handleCheckIfDetailsAlreadyExistInDB = async (
  username: string,
  email: string
) => {
  const userByEmail = await UsersServices.getByEmail(email);

  const userByUsername = await UsersServices.getByUsername(username);

  if (userByEmail || userByUsername) {
    const errors: { inputField: string; errorMessage: string }[] = [];
    if (userByEmail) {
      errors.push({
        inputField: "email",
        errorMessage: "Email already registered",
      });
    }
    if (userByUsername) {
      errors.push({
        inputField: "username",
        errorMessage: "Username is taken",
      });
    }
    throw new UsernameOrEmailInUse("Username or email already in use", errors);
  }
};
