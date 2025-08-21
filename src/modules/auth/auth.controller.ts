import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import { RegisterDTO } from "./dto/register.dto";
import { AuthService } from "./auth.service";

@injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RegisterDTO;
      const result = await this.authService.register(body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
