import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const LocationValidation = () => [
  body("lat").isNumeric(),
  body("long").isNumeric(),
  LocationBodyValidation,
];

const LocationBodyValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ isError: true });
  }
  next();
};
