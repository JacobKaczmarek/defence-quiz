import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import FacebookProvider from 'next-auth/providers/facebook';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma),
};