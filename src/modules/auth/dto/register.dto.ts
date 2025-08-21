import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../../../generated/prisma";

export class RegisterDTO {
  @IsString()
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  readonly email!: string;

  @IsNotEmpty()
  @IsString()
  readonly password!: string;

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role!: Role;
}
