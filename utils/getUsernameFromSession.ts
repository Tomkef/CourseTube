import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { customSession } from "types";

const getUsernameFromSession = async (req: NextApiRequest) => {
  const session: customSession = await getSession({ req });

  const username = session?.user?.username;

  if (username === undefined) {
    return null;
  }

  return username;
};

export default getUsernameFromSession;
