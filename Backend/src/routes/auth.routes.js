import { Router } from "express";
import {register} from "../controllers/auth.controller.js";
import { registerValidation } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @routes POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post(
  "/register",
  registerValidation,register
);

export default authRouter;