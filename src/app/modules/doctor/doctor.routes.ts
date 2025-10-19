import express from "express";
import { DoctorController } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/", DoctorController.getAllDoctorsFromDB);
router.post("/suggestion", DoctorController.getAISuggestions);
router.patch("/:id", DoctorController.updateDoctorInfo);
router.get("/:id", DoctorController.getDoctorByIdFromDB);
router.delete("/:id", auth(UserRole.ADMIN), DoctorController.deleteFromDB);
router.delete("/soft/:id", auth(UserRole.ADMIN, UserRole.PATIENT), DoctorController.softDelete);

export const DoctorRoutes = router;
