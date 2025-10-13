import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { jwtHelper } from "../helpers/jwtHelper";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new Error("You are not authorized!");
      }

      const verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt_vars.access_token_secret as string
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You are not authorized!");
      }

      // If all requirments are met, Then we will pass to the next middleware
      next();
    } catch (error) {
      next(error);
    }
  };
};
