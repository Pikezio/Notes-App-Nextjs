import { getSession } from "next-auth/react";

export async function checkSession(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else return null;
}
