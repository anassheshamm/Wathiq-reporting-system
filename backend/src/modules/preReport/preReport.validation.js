import { body } from "express-validator";

export const createPreReportValidation = [
  // ============================================================
  // References
  // ============================================================

  body("patient")
    .notEmpty()
    .withMessage("Patient is required."),

  body("teamLeader")
    .notEmpty()
    .withMessage("Team leader is required."),

  // ============================================================
  // Report Information
  // ============================================================

  body("reportInformation.programName")
    .notEmpty()
    .withMessage("Program name is required."),

  body("reportInformation.startDate")
    .notEmpty()
    .withMessage("Start date is required."),

  // ============================================================
  // General Case Information
  // ============================================================

  body("generalCaseInformation.addictionSeverity")
    .notEmpty()
    .withMessage("Addiction severity is required."),

  body("generalCaseInformation.previousSubstanceType")
    .notEmpty()
    .withMessage("Previous substance type is required."),

  body("generalCaseInformation.addictionDuration")
    .notEmpty()
    .withMessage("Addiction duration is required."),

  body("generalCaseInformation.previousRecoveryAttempts")
    .isInt({ min: 0 })
    .withMessage("Previous recovery attempts must be a valid number."),

  body("generalCaseInformation.motivations")
    .isArray({ min: 1 })
    .withMessage("At least one motivation is required."),

  // ============================================================
  // Initial Evaluations
  // ============================================================

  body("initialEvaluations.psychologicalStatus")
    .notEmpty()
    .withMessage("Psychological status is required."),

  body("initialEvaluations.behavioralStatus")
    .notEmpty()
    .withMessage("Behavioral status is required."),

  body("initialEvaluations.programCommitment")
    .notEmpty()
    .withMessage("Program commitment is required."),

  // ============================================================
  // Initial Recommendations
  // ============================================================

  body("initialRecommendations.recommendations")
    .notEmpty()
    .withMessage("Recommendations are required."),
];

export const rejectPreReportValidation = [
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required."),
];