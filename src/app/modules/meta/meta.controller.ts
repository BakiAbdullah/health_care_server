import { Request, Response } from "express";
import { MetaService } from "./meta.service";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJwtUserPayload } from "../../types/common";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(
      user as IJwtUserPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Meta data retrival successfull for ${user?.role}`,
      data: result,
    });
  }
);

export const MetaController = {
  fetchDashboardMetaData,
};
