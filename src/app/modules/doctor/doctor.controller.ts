import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pickQuery from "../../helpers/pickQuery";
import { DoctorServices } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctorsFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pickQuery(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filters = pickQuery(req.query, doctorFilterableFields);

  const result = await DoctorServices.getAllDoctorsFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateDoctorInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.updateDoctorInfo(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors updated successfully!",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctorsFromDB,
  updateDoctorInfo,
};
