import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJwtUserPayload } from "../../types/common";
import { ReviewServices } from "./review.service";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewServices.insertIntoDB(
      user as IJwtUserPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully!",
      data: result,
    });
  }
);

export const ReviewController = {
  insertIntoDB,
};
