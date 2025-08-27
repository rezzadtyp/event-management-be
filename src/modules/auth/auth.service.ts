import { injectable } from "tsyringe";
import { RegisterDTO } from "./dto/register.dto";
import { registerFunction } from "./functions/register";
import { LoginDTO } from "./dto/login.dto";
import { loginFunction } from "./functions/login";

@injectable()
export class AuthService {
  constructor() {}

  register = async (body: RegisterDTO) => {
    const result = await registerFunction(body);

    return result;
  };

  login = async (body: LoginDTO) => {
    const result = await loginFunction(body);

    return result;
  };
}
