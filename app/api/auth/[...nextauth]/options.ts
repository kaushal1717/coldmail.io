import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/util/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account.provider === "google") {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
            select: {
              id: true,
              image: true,
            },
          });

          if (!user) {
            const userCreation = await prisma.user.create({
              data: {
                email: profile.email,
                image: profile.picture,
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
