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
    async signIn({ user, account, profile: _profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user for Google OAuth
            const newUser = new User({
              fullName: user.name,
              email: user.email,
              googleId: _profile?.sub,
              provider: 'google',
            });
            await newUser.save();
          } else if (existingUser.provider === 'local') {
            // If user exists with local auth, link Google ID
            if (!existingUser.googleId) {
              existingUser.googleId = _profile?.sub;
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
    async jwt({ token, user }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.provider = dbUser.provider;
          token.fullName = dbUser.fullName;
          // Generate JWT for compatibility with existing API
          token.jwt = dbUser.getSignedJwtToken();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.jwt = token.jwt as string;
        session.user.name = token.fullName as string;
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
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account, profile: _profile }) {
      if (account?.provider === 'google') {
        console.log('Google sign-in successful for:', user.email);
      }
    },
  },
};
