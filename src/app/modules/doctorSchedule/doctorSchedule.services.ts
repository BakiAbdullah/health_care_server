import { prisma } from "../../shared/prisma";
import { IJwtUserPayload } from "../../types/common";

// Create Doctor schedule

const createScheduleIntoDB = async (
  user: IJwtUserPayload,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = payload?.scheduleIds?.map((scheduleId) => ({
    doctorId: doctorData?.id,
    scheduleId,
  }));

  return await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });
};

export const DoctorScheduleServices = {
  createScheduleIntoDB,
};
