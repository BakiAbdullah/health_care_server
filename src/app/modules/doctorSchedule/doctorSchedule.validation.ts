import z from "zod";

export const createDoctorScheduleValidationSchema = z.object({
  body: z.object({
    scheduleIds: z.array(z.string()),
  }),
});


