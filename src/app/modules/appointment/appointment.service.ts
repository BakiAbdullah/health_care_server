import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../shared/prisma";
import { IJwtUserPayload } from "../../types/common";

const createAppointment = async (
  user: IJwtUserPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const isDoctorScheduleBooked = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  // multiple operation in prisma transaction api >>>
  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        doctorId: doctorData.id,
        patientId: patientData.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingId,
      },
    });

    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidv4();


    await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId
      }
    })

    return appointmentData;
  });

  return result;
};

export const AppointmentService = {
  createAppointment,
  // getMyAppointment,
  // updateAppointmentStatus,
};
