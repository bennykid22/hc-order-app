import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      slug: string;
    } & DefaultSession["user"];
  }

  interface User {
    slug: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    slug: string;
  }
}
