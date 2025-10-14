import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleServices } from "./schedule.services";
import pickQuery from "../../helpers/pickQuery";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule created successfully!",
    data: result
  });
});


const getSchedulesForDoctor = catchAsync(
  async (req: Request, res: Response) => {
    const options = pickQuery(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]); // Pagination and sorting

    const filters = pickQuery(req.query, ["startDateTime", "endDateTime"]);
    const result = await ScheduleServices.getSchedulesForDoctor(
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Schedule fetched successfully!",
      data: result,
    });
  }
);

export const ScheduleController = {
  insertIntoDB,
  getSchedulesForDoctor,
};
