import express from "express";
import { ScheduleController } from "./schedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.DOCTOR) ,ScheduleController.insertIntoDB);
router.get("/", ScheduleController.getSchedulesForDoctor);
router.delete("/:id", ScheduleController.deleteScheduleFromDB);

export const ScheduleRoutes = router;
