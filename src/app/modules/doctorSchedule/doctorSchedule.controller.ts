import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.services";
import { IJwtUserPayload } from "../../types/common";

const createScheduleIntoDB = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleServices.createScheduleIntoDB(user as IJwtUserPayload, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule created successfully!",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createScheduleIntoDB,
};
