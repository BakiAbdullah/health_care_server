import { Request, Response } from "express";
import pickQuery from "../../helpers/pickQuery";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJwtUserPayload } from "../../types/common";
import { PrescriptionServices } from "./prescription.service";

const createPrescription = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionServices.createPrescription(
      user as IJwtUserPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Prescription created successfully!",
      data: result,
    });
  }
);

// Get my Prescription
const patientPrescription = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const options = pickQuery(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);

    const result = await PrescriptionServices.patientPrescription(
      user as IJwtUserPayload,
      options
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Prescription retrival successful!",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const PrescriptionController = {
  createPrescription,
  patientPrescription,
};
