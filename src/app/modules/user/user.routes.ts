import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploaderUtils } from "../../helpers/fileUploader";

const router = express.Router();

router.get("/", UserController.getAllUsersFromDB)

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

// Create Doctor
// Create Admin

export const UserRoutes = router;
