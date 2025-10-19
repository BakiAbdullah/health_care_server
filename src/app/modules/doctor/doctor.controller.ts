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

const getDoctorByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.getDoctorByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
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

const getAISuggestions = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.getAISuggestions(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "AI Suggestions fetched successfully!",
    data: result,
  });
});


const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.softDelete(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});



export const DoctorController = {
  getAllDoctorsFromDB,
  getDoctorByIdFromDB,
  updateDoctorInfo,
  getAISuggestions,
  deleteFromDB,
  softDelete,
};
