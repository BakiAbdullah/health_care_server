import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleController.insertIntoDB);
router.get("/", ScheduleController.getSchedulesForDoctor);

export const ScheduleRoutes = router;
