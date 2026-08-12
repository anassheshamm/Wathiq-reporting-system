import { body } from "express-validator";


export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const registerValidation = [
  body("token")
    .notEmpty()
    .withMessage("Invitation token is required."),

  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("middleName")
    .trim()
    .notEmpty()
    .withMessage("Middle name is required."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("nationalId")
  .isLength({ min: 10, max: 15 })
  .withMessage("National ID must be between 10 and 15 characters.")
  .trim(),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required."),

  body("gender")
    .isIn(["male", "female"])
    .withMessage("Invalid gender."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];