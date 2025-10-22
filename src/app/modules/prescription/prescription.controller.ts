import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PrescriptionServices } from "./prescription.service";
import { IJwtUserPayload } from "../../types/common";

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

export const PrescriptionController = {
  createPrescription,
};
