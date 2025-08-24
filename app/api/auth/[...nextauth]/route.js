import NextAuth from 'next-auth';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "../../../../lib/db";
import User from "../../../models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text:email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        await connectDB();
        const { email, password } = credentials;

        // Find user
        const user = await User.findOne({ email });
        if (!user) throw new Error("No user found with this email");

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) throw new Error("Invalid password");

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

callbacks: {
  async jwt({ token, account, profile }) {
    if (account) {
      await connectDB();
      let user = await User.findOne({ email: token.email });

      if (!user) {
        // Create user with Google/GitHub name if not found
        user = await User.create({
          name: profile.name || "",
          email: token.email,
          passwordHash: null
        });
      }

      // Always attach DB name (manual or existing) to token
      token.name = user.name;
    }
    return token;
  },

  async session({ session, token }) {
    session.user.name = token.name;
    return session;
  }
}
});
export { handler as GET, handler as POST };
