import { hashPassword } from "../../../lib/bcrypt";
import prisma from "../../../prisma";
import { ApiError } from "../../../utils/api-error";
import { RegisterDTO } from "../dto/register.dto";

function generateReferralCode(name: string) {
  return (
    name.toLowerCase().replace(/\s+/g, "").slice(0, 4) +
    Math.random().toString(36).substring(2, 15)
  );
}

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

    let referralCode = generateReferralCode(body.name);

    let checkReferralCode = await prisma.userReferral.findUnique({
      where: { referralCode },
    });

    while (checkReferralCode) {
      referralCode = generateReferralCode(body.name);

      checkReferralCode = await prisma.userReferral.findUnique({
        where: { referralCode },
      });
    }

    await prisma.userReferral.create({
      data: {
        referralCode,
        userId: newUser.id,
      },
    });

    return {
      message: "User created successfully",
      data: {
        user: newUser,
        referralCode,
      },
    };
  } catch (error) {
    throw error;
  }
};
