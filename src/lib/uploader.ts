import { Request } from "express";
import multer, { FileFilterCallback, Options } from "multer";
import { join } from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

export const uploader = (
  filePreFix: string,
  foldername?: string,
  filelimit?: number
) => {
  const defaultDir = join(process.cwd(), "public");

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      const destination = foldername ? join(defaultDir, foldername) : defaultDir;
      cb(null, destination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FilenameCallback
    ) => {
      const originalnameParts = file.originalname.split(".");
      const fileExtension = originalnameParts[originalnameParts.length - 1];
      const newFileName =
        filePreFix +
        Date.now() +
        file.originalname.length +
        "." +
        fileExtension;

      cb(null, newFileName);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const extAllowed = /\.(jpg|jpeg|png|webp|avif)$/;
    const isExtMatch = file.originalname.toLowerCase().match(extAllowed);
    if (isExtMatch) {
      cb(null, true);
    } else {
      const error = new Error("Your file extension is denied");
      cb(null, false);
      cb(error);
    }
  };

  const limits = { fileSize: filelimit || 1 * 1024 * 1024 };

  return multer({ storage, fileFilter, limits });
};

export const uploaderCloudinary = (filelimit?: number) => {
  const storage = multer.memoryStorage();

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const extAllowed = /\.(jpg|jpeg|png|webp|avif)$/;
    const isExtMatch = file.originalname.toLowerCase().match(extAllowed);
    if (isExtMatch) {
      cb(null, true);
    } else {
      const error = new Error("Your file extension is denied");
      cb(error);
    }
  };

  const limits = { fileSize: filelimit || 1 * 1024 * 1024 }; // default 1mb

  return multer({ storage, fileFilter, limits });
};
