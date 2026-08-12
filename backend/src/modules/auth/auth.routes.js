import { Router } from "express";

import authController from "./auth.controller.js";
import { loginValidation } from "./auth.validation.js";
import validate from "../../middlewares/validate.middleware.js";
import { registerValidation } from "./auth.validation.js";

const router = Router();

router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

export default router;