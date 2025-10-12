import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { jwtHelper } from "../../helpers/jwtHelper";

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

  // Now if all ok => we will generate jwt access & refresh token
  const accessToken = jwtHelper.generateToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt_vars.access_token_secret as string,
    "1h"
  );

  // Generate Refresh token
  const refreshToken = jwtHelper.generateToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt_vars.refresh_token_secret as string,
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange
  };
};

export const AuthServices = {
  login,
};
