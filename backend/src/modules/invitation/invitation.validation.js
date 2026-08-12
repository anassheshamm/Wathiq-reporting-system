import { body } from "express-validator";

export const createInvitationValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("role")
    .isIn(["admin", "teamLeader", "doctor"])
    .withMessage("Invalid role"),
];