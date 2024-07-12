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

export const handleDelete = async (emailId: string) => {
  try {
    const deletedItem = await prisma.email.delete({
      where: {
        id: emailId,
      },
    });
    return deletedItem;
  } catch (error) {
    console.log(error);
  }
};

export const handleGetWithId = async (emailId: string) => {
  try {
    const getEmail = await prisma.email.findUnique({
      where: {
        id: emailId,
      },
    });

    return getEmail;
  } catch (error) {
    console.log(error);
  }
};

export const editTemplate = async (
  emailId: string,
  subject: string,
  content: string
) => {
  try {
    const editedEmail = await prisma.email.update({
      where: {
        id: emailId,
      },
      data: {
        subject: subject,
        content: content,
      },
    });

    return editedEmail;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserDetails = async () => {
  const session: CustomSession | null = await getServerSession(authOptions);
  try {
    const userDetails = await prisma.user.findUnique({
      where: {
        userId: session?.user?.id!,
      },
      select: {
        totalEmails: true,
        subscription: true,
      },
    });
    return userDetails;
  } catch (error) {
    console.log(error);
  }
};
