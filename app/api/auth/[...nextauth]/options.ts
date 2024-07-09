import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/util/db";
import { ISODateString, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}

export interface CustomUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({
      session,
      user,
      token,
    }: {
      session: CustomSession;
      user: User;
      token: JWT;
    }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ account, profile }: any) {
      if (account.provider === "google") {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
            select: {
              userId: true,
              image: true,
            },
          });

          if (!user) {
            const userCreation = await prisma.user.create({
              data: {
                email: profile.email,
                image: profile.picture,
                userId: profile.sub,
              },
            });

            if (userCreation) return true;
          } else {
            if (user.image != profile.picture) {
              await prisma.user.update({
                data: {
                  image: user.image,
                },
                where: {
                  email: profile.email,
                },
              });
            }
            return true;
          }
        } catch (e) {
          console.log(e);
        }
      }
      return false;
    },
  },
};
