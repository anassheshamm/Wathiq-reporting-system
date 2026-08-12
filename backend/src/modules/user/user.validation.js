import { body } from "express-validator";

export const createUserValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim(),

  body("middleName")
    .notEmpty()
    .withMessage("Middle name is required")
    .trim(),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .trim(),

  body("nationalId")
    .notEmpty()
    .withMessage("National ID is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("role")
    .isIn(["admin", "doctor", "teamLeader"])
    .withMessage("Invalid role"),
];