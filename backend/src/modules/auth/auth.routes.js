import { Router } from "express";

import authController from "./auth.controller.js";

import {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "./auth.validation.js";

import validate from "../../middlewares/validate.middleware.js";

const router = Router();

router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

export default router;