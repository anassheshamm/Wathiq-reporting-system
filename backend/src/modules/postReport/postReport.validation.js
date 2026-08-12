import { body } from "express-validator";

export const createPostReportValidation = [
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
  // Beneficiary Information
  // ============================================================

  body("beneficiaryInformation.programName")
    .notEmpty()
    .withMessage("Program name is required."),

  body("beneficiaryInformation.counselorName")
    .notEmpty()
    .withMessage("Counselor name is required."),

  body("beneficiaryInformation.startDate")
    .notEmpty()
    .withMessage("Start date is required."),

  body("beneficiaryInformation.graduationDate")
    .notEmpty()
    .withMessage("Graduation date is required."),

  // ============================================================
  // Case Summary
  // ============================================================

  body("caseSummary.summary")
    .trim()
    .notEmpty()
    .withMessage("Case summary is required."),

  body("caseSummary.addictionSeverity")
    .notEmpty()
    .withMessage("Addiction severity is required."),

  // ============================================================
  // Progress Assessment
  // ============================================================

  body("progressAssessment.psychologicalStatus")
    .notEmpty()
    .withMessage("Psychological status is required."),

  body("progressAssessment.behavioralStatus")
    .notEmpty()
    .withMessage("Behavioral status is required."),

  body("progressAssessment.socialStatus")
    .notEmpty()
    .withMessage("Social status is required."),

  // ============================================================
  // Program Progress
  // ============================================================

  body("programProgress.overallImprovement")
    .notEmpty()
    .withMessage("Overall improvement is required."),

  body("programProgress.treatmentCommitment")
    .notEmpty()
    .withMessage("Treatment commitment is required."),

  body("programProgress.activityParticipation")
    .notEmpty()
    .withMessage("Activity participation is required."),

  body("programProgress.emotionalStability")
    .notEmpty()
    .withMessage("Emotional stability is required."),

  body("programProgress.familyRelationship")
    .notEmpty()
    .withMessage("Family relationship is required."),

  body("programProgress.communityReadiness")
    .notEmpty()
    .withMessage("Community readiness is required."),

  // ============================================================
  // Recovery
  // ============================================================

  body("recoveryStability")
    .notEmpty()
    .withMessage("Recovery stability is required."),

  body("personalPlanReadiness")
    .notEmpty()
    .withMessage("Personal plan readiness is required."),

  // ============================================================
  // Notes
  // ============================================================

  body("familyNotification.notes")
    .optional()
    .trim(),

  body("recommendations")
    .optional()
    .trim(),

  body("additionalNotes")
    .optional()
    .trim(),
];

export const rejectPostReportValidation = [
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required."),
];