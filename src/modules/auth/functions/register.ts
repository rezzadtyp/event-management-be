import { hashPassword } from "../../../lib/bcrypt";
import prisma from "../../../prisma";
import { ApiError } from "../../../utils/api-error";
import { RegisterDTO } from "../dto/register.dto";

function generateReferralCode(name: string): string {
  return (
    name.toLowerCase().replace(/\s+/g, "").slice(0, 4) +
    Math.random().toString(36).substring(2, 15)
  );
}

function generateCouponCode(): string {
  return "REFBONUS" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const registerFunction = async (body: RegisterDTO) => {
  try {
    console.log(body);
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) throw new ApiError("User already exists", 400);

    const hashedPassword = await hashPassword(body.password);

    // Generate unique referral code
    let referralCode = generateReferralCode(body.name);
    let isReferralCodeUnique = false;

    while (!isReferralCodeUnique) {
      const existingReferralUser = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (!existingReferralUser) {
        isReferralCodeUnique = true;
      } else {
        referralCode = generateReferralCode(body.name);
      }
    }

    // Set point expiration to 3 months from now (even though initial points are 0)
    const pointExpiration = new Date();
    pointExpiration.setMonth(pointExpiration.getMonth() + 3);

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || "CUSTOMER",
        referralCode,
        pointExpiredAt: pointExpiration,
      },
    });

    // Handle referral rewards if referral code is provided
    if (body.referralCode) {
      const referralUser = await prisma.user.findUnique({
        where: { referralCode: body.referralCode },
      });

      if (!referralUser) {
        throw new ApiError("Invalid referral code", 400);
      }

      await prisma.$transaction(async (tx) => {
        // Create coupon for new user (3 months expiration)
        const couponExpiration = new Date();
        couponExpiration.setMonth(couponExpiration.getMonth() + 3);

        const coupon = await tx.coupon.create({
          data: {
            code: generateCouponCode(),
            discountAmount: 15000, // IDR 15,000
            expirationDate: couponExpiration,
            userId: newUser.id,
          },
        });

        // Link coupon to user
        await tx.userCoupon.create({
          data: {
            userId: newUser.id,
            couponId: coupon.id,
            isUse: false,
          },
        });

        // Give points to referrer (3 months expiration from now)
        const referrerPointExpiration = new Date();
        referrerPointExpiration.setMonth(
          referrerPointExpiration.getMonth() + 3
        );

        await tx.user.update({
          where: { id: referralUser.id },
          data: {
            point: { increment: 10000 }, // Add 10,000 points
            pointExpiredAt: referrerPointExpiration, // Set new expiration
          },
        });
      });
    }

    return {
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode,
      },
    };
  } catch (error) {
    throw error;
  }
};
