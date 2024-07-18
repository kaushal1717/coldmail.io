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

    if (user.subscription == "free") {
      if (user.totalEmails >= 8 && user.maxCapacity == false) {
        await prisma.user.update({
          where: {
            userId: session?.user?.id!,
          },
          data: {
            maxCapacity: true,
          },
        });
      }
    } else if (user.subscription == "premium") {
      if (user.totalEmails >= 20 && user.maxCapacity == false) {
        await prisma.user.update({
          where: {
            userId: session?.user?.id!,
          },
          data: {
            maxCapacity: true,
          },
        });
      }
    }

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
  const session: CustomSession | null = await getServerSession(authOptions);
  try {
    const deletedItem = await prisma.email.delete({
      where: {
        id: emailId,
      },
    });

    if (deletedItem) {
      await prisma.user.update({
        where: {
          userId: session?.user?.id,
        },
        data: {
          totalEmails: {
            decrement: 1,
          },
        },
      });
    }
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

export const getLimitStatus = async (userId?: string) => {
  const session: CustomSession | null = await getServerSession(authOptions);
  try {
    const limitStatus = await prisma.user.findUnique({
      where: {
        userId: session?.user?.id || userId,
      },
      select: {
        totalEmails: true,
        maxCapacity: true,
        subscription: true,
      },
    });
    return limitStatus;
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
        maxCapacity: true,
      },
    });
    return userDetails;
  } catch (error) {
    console.log(error);
  }
};

export const onPaymentSuccess = async (subscription: string) => {
  const session: CustomSession | null = await getServerSession(authOptions);
  try {
    const userLimitStatus = await getLimitStatus(session?.user?.id);
    const user = await prisma.user.update({
      where: {
        userId: session?.user?.id!,
      },
      data: {
        subscription: subscription,
        maxCapacity: userLimitStatus?.maxCapacity ? false : true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};
