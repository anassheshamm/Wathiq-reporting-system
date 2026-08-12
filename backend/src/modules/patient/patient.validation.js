import { body } from "express-validator";

export const createPatientValidation = [
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
  .isLength({ min: 10, max: 15 })
  .withMessage(
    "National ID must be between 10 and 15 characters."
  ),

  body("gender")
    .isIn(["male", "female"])
    .withMessage("Invalid gender"),

  body("nationality")
    .notEmpty()
    .withMessage("Nationality is required"),

  body("occupation").optional(),

  body("maritalStatus")
    .optional()
    .isIn(["single", "married", "divorced", "widowed"]),

  body("dateOfBirth")
    .isISO8601()
    .withMessage("Invalid date"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required"),

  body("alternativePhone").optional(),

  body("email")
  .optional({ checkFalsy: true })
  .isEmail()
  .withMessage("Invalid email"),

  body("emergencyContactPhone").optional(),

  body("emergencyContactRelation").optional(),

  body("address").optional(),
];

export const updatePatientValidation = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty(),

  body("middleName")
    .optional()
    .trim()
    .notEmpty(),

  body("lastName")
    .optional()
    .trim()
    .notEmpty(),

  body("nationalId")
  .isLength({ min: 10, max: 15 })
  .withMessage(
    "National ID must be between 10 and 15 characters."
  ),

  body("gender")
    .optional()
    .isIn(["male", "female"]),

  body("nationality")
    .optional(),

  body("occupation")
    .optional(),

  body("maritalStatus")
    .optional()
    .isIn([
      "single",
      "married",
      "divorced",
      "widowed",
    ]),

  body("dateOfBirth")
    .optional()
    .isISO8601(),

  body("phone")
    .optional(),

  body("alternativePhone")
    .optional(),

  body("email")
  .optional({ checkFalsy: true })
  .isEmail()
  .withMessage("Invalid email"),

  body("emergencyContactPhone")
    .optional(),

  body("emergencyContactRelation")
    .optional(),

  body("address")
    .optional(),
];