import { UserRole } from "@prisma/client";
import express from "express";
import { auth } from "../../middlewares/auth";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  DoctorController.getAllDoctorsFromDB
);
router.post("/suggestion", DoctorController.getAISuggestions);
router.patch("/:id", DoctorController.updateDoctorInfo);

export const DoctorRoutes = router;
