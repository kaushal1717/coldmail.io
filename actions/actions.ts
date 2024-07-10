"use server";
import {
  authOptions,
  CustomSession,
} from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@/util/db";

export const handleSave = async (
  response: string,
  subject: string,
  category: string
) => {
  const session: CustomSession | null = await getServerSession(authOptions);
  try {
    const email = await prisma.email.create({
      data: {
        authorId: session?.user?.id!,
        content: response,
        subject: subject,
        category: category,
      },
    });

    const user = await prisma.user.update({
      where: {
        userId: session?.user?.id!,
      },
      data: {
        totalEmails: { increment: 1 },
      },
    });
    return email;
  } catch (error) {
    console.log(error);
  }
};

export const handleGet = async () => {
  const session: CustomSession | null = await getServerSession(authOptions);
  try {
    const template = await prisma.user.findMany({
      include: {
        emails: {
          select: {
            id: true,
            content: true,
            category: true,
            subject: true,
          },
        },
      },
      where: {
        userId: session?.user?.id!,
      },
    });
    return template;
  } catch (error) {
    console.log(error);
  }
};
