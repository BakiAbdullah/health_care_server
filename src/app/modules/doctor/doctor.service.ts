import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helpers/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllDoctorsFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialities, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Searching using doctor specialities "Medicine" | "Gynae Obs"
  if (specialities && specialities.length > 0) {
    andConditions.push({
      doctorSpecialities: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive"
            }
          }
        }
      }
    })
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions?.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true
        }
      }
    }
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
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

const updateDoctorInfo = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const { specialities, ...doctorData } = payload;

  return await prisma.$transaction(async (tnx) => {
    if (specialities && specialities.length > 0) {
      const deleteSpecialityIds = specialities.filter(
        (speciality) => speciality.isDeleted
      );

      for (const speciality of deleteSpecialityIds) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: speciality.specialityId,
          },
        });
      }

      const createSpecialityIds = specialities.filter(
        (speciality) => !speciality.isDeleted
      );

      for (const speciality of createSpecialityIds) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialitiesId: speciality.specialityId,
          },
        });
      }
    }

    const updatedData = await tnx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData,
      include: {
        doctorSpecialities: {
          include: { specialities: true },
        },
      },
    });

    return updatedData;
  });
};

export const DoctorServices = {
  getAllDoctorsFromDB,
  updateDoctorInfo,
};
