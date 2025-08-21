import { hashPassword } from "../../../lib/bcrypt";
import prisma from "../../../prisma";
import { ApiError } from "../../../utils/api-error";
import { RegisterDTO } from "../dto/register.dto";

export const register = async (body: RegisterDTO) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) throw new ApiError("User already exist", 400);

    const hashedPassword = await hashPassword(body.password);

    const newUser = await prisma.user.create({
      data: { ...body, password: hashedPassword },
    });

    return {
      message: "User created successfully",
      data: newUser,
    };
  } catch (error) {
    throw error;
  }
};
