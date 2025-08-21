import { RequestHandler } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "../config";

const secretKey = appConfig.jwtSecret!;

interface PayloadToken {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: PayloadToken;
    }
  }
}

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .send({ message: "Authentication failed, token is missing" });
    return;
  }

  jwt.verify(token, secretKey, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        res.status(403).send({ message: "Token expired" });
      } else {
        res.status(403).send({ message: "Invalid Token" });
      }
      return;
    }

    req.user = payload as PayloadToken;
    next();
  });
};
