import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pickQuery from "../../helpers/pickQuery";
import { userFilterableFields } from "./user.constant";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createDoctor(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});


const getAllUsersFromDB = catchAsync(async (req: Request, res: Response) => {
  //? page, limit, sortBy, sortOrder - Pagination, sorting
  //? fields, searchTerm - searching, filtering

  const filters = pickQuery(req.query, userFilterableFields); // searching, filtering
  const options = pickQuery(req.query, [
    "page", 
    "limit",
    "sortBy",
    "sortOrder",
  ]); // Pagination and sorting

  // const { page, limit, searchTerm, sortBy, sortOrder, role, status } =
  //   req.query;

  // const result = await UserServices.getAllUsersFromDB({
  //   page: Number(page),
  //   limit: Number(limit),
  //   searchTerm: searchTerm || "",
  //   sortBy,
  //   sortOrder,
  //   role,
  //   status,
  // });

  const result = await UserServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "All Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  createPatient,
  getAllUsersFromDB,
  createAdmin,
  createDoctor,
};
