import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { CUSTOMERS } from "../../../lib/config";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const enteredEmail = credentials.email.toLowerCase();
        const entry = Object.entries(CUSTOMERS).find(([, customer]) =>
          customer.emails.some((email) => email.toLowerCase() === enteredEmail)
        );
        if (!entry) return null;

        const [slug, customer] = entry;
        const valid = await bcrypt.compare(credentials.password, customer.passwordHash);
        if (!valid) return null;

        return { id: slug, slug, name: customer.name, email: enteredEmail };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.slug = user.slug;
      return token;
    },
    async session({ session, token }) {
      session.user.slug = token.slug;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
