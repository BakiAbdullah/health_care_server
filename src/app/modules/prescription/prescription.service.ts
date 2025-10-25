import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  UserRole,
} from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { IJwtUserPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IOptions, paginationHelper } from "../../helpers/paginationHelper";

const createPrescription = async (
  user: IJwtUserPayload,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email))
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This is not your appointment!"
      );
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instruction: payload.instruction as string,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

// Get patient prescription
const patientPrescription = async (
  user: IJwtUserPayload,
  options: IOptions
) => {
  const { limit, page, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};



export const PrescriptionServices = {
  createPrescription,
  patientPrescription,
};
