import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
// minimum 6 chars, at least 1 letter and 1 number


export const registerValidation = [

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^[a-zA-Z0-9_]{3,}$/)
    .withMessage("Username must be at least 3 characters and contain only letters, numbers or underscore"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .matches(emailRegex)
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(passwordRegex)
    .withMessage("Password must be at least 6 characters and include a number"),

  validate
];


export const loginValidator = [

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .matches(emailRegex)
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(passwordRegex)
    .withMessage("Password must contain at least 6 characters including a number"),

  validate
];