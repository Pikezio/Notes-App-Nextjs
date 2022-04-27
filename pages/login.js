import { signIn } from "next-auth/react";
import React, { useEffect } from "react";
import { checkSession } from "../middleware/checkSession";

const Login = ({ login }) => {
  useEffect(() => {
    if (login) {
      signIn();
    }
  }, [login]);

  return <div>Nukreipiama į prisijungimą...</div>;
};

export default Login;

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession) {
    return {
      props: {
        login: true,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
