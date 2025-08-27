import { appConfig } from "../../../config";
import { comparePassword } from "../../../lib/bcrypt";
import prisma from "../../../prisma";
import { ApiError } from "../../../utils/api-error";
import { LoginDTO } from "../dto/login.dto";
import jwt from "jsonwebtoken";

export const loginFunction = async (body: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) throw new ApiError("User not found", 404);

  const isPasswordValid = await comparePassword(body.password, user.password);

  if (!isPasswordValid) throw new ApiError("Invalid password", 400);

  const token = jwt.sign({ id: user.id }, appConfig.jwtSecret!, {
    expiresIn: "24h",
  });

  return {
    message: "Login successful",
    data: {
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
