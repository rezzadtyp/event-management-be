import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(json());
app.use(helmet());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(400).send({ message: err.message });
});

export default app;
