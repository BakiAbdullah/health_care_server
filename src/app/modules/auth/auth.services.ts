import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";

const login = async (credentials: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: credentials?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect!!");
  }

  

  console.log(credentials);
  return "result";
};

export const AuthServices = {
  login,
};
