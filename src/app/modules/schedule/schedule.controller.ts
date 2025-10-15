import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleServices } from "./schedule.services";
import pickQuery from "../../helpers/pickQuery";
import { IJwtUserPayload } from "../../types/common";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const getSchedulesForDoctor = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const options = pickQuery(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]); // Pagination and sorting

    const filters = pickQuery(req.query, ["startDateTime", "endDateTime"]);

    const user = req.user;
    const result = await ScheduleServices.getSchedulesForDoctor(
      req.user as IJwtUserPayload,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleServices.deleteScheduleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule deleted successfully!",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  getSchedulesForDoctor,
  deleteScheduleFromDB,
};
