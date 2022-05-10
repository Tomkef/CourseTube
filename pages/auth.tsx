import { getSession } from "next-auth/react";

import dynamic from "next/dynamic";
const AuthForm = dynamic(() => import("components/AuthForm"), { ssr: false });

function AuthPage() {
  return <AuthForm />;
}

export default AuthPage;

export async function getServerSideProps(context) {
  try {
    let session = await getSession(context);

    if (session) {
      return {
        redirect: {
          destination: "/courses",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (error) {
    console.log("ERROR: ", error.message);
    return {
      props: {},
    };
  }
}
