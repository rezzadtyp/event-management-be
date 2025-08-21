import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { AuthController } from "./auth.controller";
import { RegisterDTO } from "./dto/register.dto";
import { validateBody } from "../../middlewares/validation.middleware";

@autoInjectable()
export class AuthRouter {
  private readonly router: Router = Router();

  constructor(private readonly authController: AuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      validateBody(RegisterDTO),
      this.authController.register
    );
  }

  public getRouter() {
    return this.router;
  }
}
