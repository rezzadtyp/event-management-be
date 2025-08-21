import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { appConfig } from "./config";

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
    this.app.get("/health", (req: Request, res: Response) => {
      res.send({ message: "OK" });
    });
  }

  private errorHandler(): void {
    this.app.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        res.status(400).send({ message: err.message });
      }
    );
  }

  public start(): void {
    this.app.listen(appConfig.port, () => {
      console.log(`Server is running on port ${appConfig.port}`);
    });
  }
}
