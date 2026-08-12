import mongoose from "mongoose";

/* ============================================================
   Report Information
   ============================================================ */

const reportInformationSchema = new mongoose.Schema(
  {
    programName: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

/* ============================================================
   General Case Information
   ============================================================ */

const generalCaseInformationSchema = new mongoose.Schema(
  {
    addictionSeverity: {
      type: String,
      trim: true,
    },

    previousSubstanceType: {
      type: String,
      trim: true,
    },

    addictionDuration: {
      type: String,
      trim: true,
    },

    previousRecoveryAttempts: {
      type: Number,
      default: 0,
    },

    motivations: [
      {
        type: String,
        enum: ["personal", "family", "legal", "other"],
      },
    ],
  },
  { _id: false }
);

/* ============================================================
   Initial Evaluations
   ============================================================ */

const initialEvaluationsSchema = new mongoose.Schema(
  {
    psychologicalStatus: {
      type: String,
      enum: ["stable", "mild_disorder", "severe_disorder"],
    },

    behavioralStatus: {
      type: String,
      enum: ["cooperative", "hesitant", "aggressive"],
    },

    programCommitment: {
      type: String,
      enum: ["high", "medium", "low"],
    },
  },
  { _id: false }
);

/* ============================================================
   Initial Recommendations
   ============================================================ */

const initialRecommendationsSchema = new mongoose.Schema(
  {
    recommendations: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/* ============================================================
   Approval Workflow
   ============================================================ */

const approvalSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

/* ============================================================
   Pre Report
   ============================================================ */

const preReportSchema = new mongoose.Schema(
  {
    // Patient
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Doctor who created the report
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Team leader selected by the doctor
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Report Sections
    reportInformation: {
      type: reportInformationSchema,
      required: true,
    },

    generalCaseInformation: {
      type: generalCaseInformationSchema,
      required: true,
    },

    initialEvaluations: {
      type: initialEvaluationsSchema,
      required: true,
    },

    initialRecommendations: {
      type: initialRecommendationsSchema,
      required: true,
    },

    // Approval Workflow
    approval: {
      type: approvalSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PreReport", preReportSchema);