import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "/tmp/my-uploads");
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary.CLOUD_NAME,
    api_key: config.cloudinary.CLOUDINARY_API_KEY,
    api_secret: config.cloudinary.CLOUDINARY_API_SECRET,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.filename,
    })
    .catch((error) => {
      console.log(error);
    });
  return uploadResult;
};

export const fileUploaderUtils = {
  upload,
  uploadToCloudinary,
};
