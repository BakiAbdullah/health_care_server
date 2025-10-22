import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJwtUserPayload } from "../../types/common";
import { AppointmentService } from "./appointment.service";
import pickQuery from "../../helpers/pickQuery";
import httpStatus from "http-status";
import { appointmentFilterableFields } from "./appointment.constant";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(
      user as IJwtUserPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment created successfully!",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const options = pickQuery(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const fillters = pickQuery(req.query, ["status", "paymentStatus"]);
    const user = req.user;
    const result = await AppointmentService.getMyAppointment(
      user as IJwtUserPayload,
      fillters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment fetched successfully!",
      data: result,
    });
  }
);

const updateAppointmentStatus = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await AppointmentService.updateAppointmentStatus(
      id,
      status,
      user as IJwtUserPayload
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment updated successfully!",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pickQuery(req.query, appointmentFilterableFields);
  const options = pickQuery(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await AppointmentService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
  getAllFromDB,
};
