import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient();

const signIn = async () => {
  await authClient.signIn.social({
    provider: "naver",
    callbackURL: "/dashboard",
  });
};

const signOut = async () => {
  await authClient.signOut();
};

export { signIn, signOut };
