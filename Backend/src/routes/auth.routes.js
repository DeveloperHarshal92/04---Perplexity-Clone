import { Router } from "express";
import {
  getMe,
  login,
  register,
  verifyEmail,
  resendVerificationEmail
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  registerValidation,
} from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @routes POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @body {username,email,password}
 */
authRouter.post("/register", registerValidation, register);

/**
 * @routes GET /api/auth/verify-email
 * @description Verify user email
 * @access Public
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @routes POST /api/auth/login
 * @description Login user and return JWT token
 * @access Public
 * @body {email,password}
 */
authRouter.post("/login", loginValidator, login);

/**
 * @routes GET /api/auth/get-me
 * @description Get current logged in user's details
 * @access Private
 */
authRouter.get("/get-me", authUser, getMe);

/**
 * @routes POST /api/auth/get-me
 * @description Get a new verification email
 * @access Private
 */
authRouter.post("/resend-verification", resendVerificationEmail);

export default authRouter;
