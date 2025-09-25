import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@/models/User';
import dbConnect from './mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user for Google OAuth
            const newUser = new User({
              fullName: user.name,
              email: user.email,
              googleId: profile?.sub,
              provider: 'google',
            });
            await newUser.save();
          } else if (existingUser.provider === 'local') {
            // If user exists with local auth, link Google ID
            if (!existingUser.googleId) {
              existingUser.googleId = profile?.sub;
              await existingUser.save();
            }
          }
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.provider = dbUser.provider;
          // Generate JWT for compatibility
          token.jwt = dbUser.getSignedJwtToken();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        (session.user as any).jwt = token.jwt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};
