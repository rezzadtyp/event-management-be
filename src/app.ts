import cors from "cors";
import express, { json, Request, Response, urlencoded } from "express";
import helmet from "helmet";
import "reflect-metadata";
import { container } from "tsyringe";
import { appConfig } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AuthRouter } from "./modules/auth/auth.router";

export default class App {
  public app;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(helmet());
  }

  private routes(): void {
    const authRouter = container.resolve(AuthRouter);
    this.app.get("/health", (_req: Request, res: Response) => {
      res.send({ message: "OK" });
    });
    this.app.use("/api/auth", authRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use(errorMiddleware);
  }

  public start(): void {
    this.app.listen(appConfig.port, () => {
      console.log(`Server is running on port ${appConfig.port}`);
    });
  }
}
