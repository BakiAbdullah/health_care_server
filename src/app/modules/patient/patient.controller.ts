import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { patientFilterableFields } from "./patient.constant";
import { PatientService } from "./patient.service";
import sendResponse from "../../shared/sendResponse";
import pickQuery from "../../helpers/pickQuery";
import { IJwtUserPayload } from "../../types/common";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pickQuery(req.query, patientFilterableFields);
  const options = pickQuery(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await PatientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.softDelete(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await PatientService.updateIntoDB(
      user as IJwtUserPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Patient updated successfully",
      data: result,
    });
  }
);

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  softDelete,
  updateIntoDB,
};
