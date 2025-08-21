import { injectable } from "tsyringe";
import { RegisterDTO } from "./dto/register.dto";
import { register } from "./functions/register";

@injectable()
export class AuthService {
  constructor() {}

  register = async (body: RegisterDTO) => {
    const user = await register(body);

    return user;
  };
}
