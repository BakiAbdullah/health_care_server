import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploaderUtils } from "../../helpers/fileUploader";

const router = express.Router();

router.post(
  "/create-patient",
  fileUploaderUtils.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.creatPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPatient(req, res, next);
  }
);

export const UserRoutes = router;
