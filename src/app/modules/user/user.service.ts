import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploaderUtils } from "../../helpers/fileUploader";

const createPatient = async (req: Request) => {
  if (req?.file) {
    const uploadedResult = await fileUploaderUtils.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};

const getAllUsersFromDB = async (filters: any, options: any) => {
  
  
  // Fallback to prevent server carsh
  const pageNumber = options.page || 1;
  const limitNumber = options.limit || 10;
  const skip = (pageNumber - 1) * limitNumber;

  console.log(status, role)

  const result = await prisma.user.findMany({
    skip: skip,
    take: limitNumber,
    where: {
      email: {
        contains: searchTerm,
        mode: "insensitive",
      },
      role: role,
      status: status
    },
    // orderBy: {
    //   createdAt: 'asc'
    // }
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  return result;
};

export const UserServices = {
  createPatient,
  getAllUsersFromDB,
};
