import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate key error";
        error = err.meta;
        statusCode = httpStatus.CONFLICT
    }

    if (err.code == "P1000") {
      message = "Authentication failed against the database server";
        error = err.meta;
        statusCode = httpStatus.BAD_GATEWAY;
    }

    if (err.code == "P2003") {
      message = "Foreign key constraint failed";
      statusCode = httpStatus.BAD_REQUEST;
    }
  }

  // Client Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
      (message = "Validation Error"), (error = err.message);
      statusCode = httpStatus.BAD_REQUEST;
  }

  // Client Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    (message = "Prisma Unknown Error Occured"), (error = err.message);
    statusCode = httpStatus.BAD_REQUEST;
  }
  // Client Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    (message = "Prisma Client failed to initialized"), (error = err.message);
    statusCode = httpStatus.BAD_REQUEST;
  }   

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
