import { Gender } from "@prisma/client";

export interface IDoctorUpdateInput {
  name: string;
  id: string;
  email: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;

  specialities: {
    specialityId: string;
    isDeleted?: boolean;
  }[];
}
