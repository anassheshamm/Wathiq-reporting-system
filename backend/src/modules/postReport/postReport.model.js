import mongoose from "mongoose";

const postReportSchema = new mongoose.Schema(
  {
    // ==========================
    // Relations
    // ==========================
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================
    // Beneficiary Information
    // ==========================
    beneficiaryInformation: {
      programName: {
        type: String,
        required: true,
        trim: true,
      },

      counselorName: {
        type: String,
        required: true,
        trim: true,
      },

      startDate: {
        type: Date,
        required: true,
      },

      graduationDate: {
        type: Date,
        required: true,
      },
    },

    // ==========================
    // Case Summary
    // ==========================
    caseSummary: {
      summary: {
        type: String,
        required: true,
        trim: true,
      },

      addictionSeverity: {
        type: String,
        enum: [
          "mild",
          "moderate",
          "severe",
        ],
        required: true,
      },
    },

    // ==========================
    // Progress Assessment
    // ==========================
    progressAssessment: {
      psychologicalStatus: {
        type: String,
        enum: [
          "significant_improvement",
          "moderate_improvement",
          "no_improvement",
        ],
        required: true,
      },

      behavioralStatus: {
        type: String,
        enum: [
          "high_commitment",
          "medium_commitment",
          "difficulty_commitment",
        ],
        required: true,
      },

      socialStatus: {
        type: String,
        enum: [
          "positive_interaction",
          "limited_interaction",
          "social_isolation",
        ],
        required: true,
      },
    },

    // ==========================
    // Program Progress
    // ==========================
    programProgress: {
      overallImprovement: {
        type: String,
        enum: [
          "excellent",
          "good",
          "limited",
        ],
        required: true,
      },

      treatmentCommitment: {
        type: String,
        enum: [
          "fully_committed",
          "partially_committed",
          "not_committed",
        ],
        required: true,
      },

      activityParticipation: {
        type: String,
        enum: [
          "active",
          "average",
          "weak",
        ],
        required: true,
      },

      emotionalStability: {
        type: String,
        enum: [
          "stable",
          "fluctuating",
          "disturbed",
        ],
        required: true,
      },

      familyRelationship: {
        type: String,
        enum: [
          "improved",
          "unchanged",
          "still_tense",
        ],
        required: true,
      },

      communityReadiness: {
        type: String,
        enum: [
          "ready",
          "needs_support",
          "not_ready",
        ],
        required: true,
      },
    },

    // ==========================
    // Recovery Stability
    // ==========================
    recoveryStability: {
      type: String,
      enum: [
        "very_good",
        "acceptable",
        "weak",
      ],
      required: true,
    },

    // ==========================
    // Personal Plan Readiness
    // ==========================
    personalPlanReadiness: {
      type: String,
      enum: [
        "ready",
        "under_development",
        "not_ready",
      ],
      required: true,
    },

    // ==========================
    // Family Notification
    // ==========================
    familyNotification: {
      notes: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // ==========================
    // Counselor Recommendations
    // ==========================
    recommendations: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // Additional Notes
    // ==========================
    additionalNotes: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // Approval
    // ==========================
    approval: {
      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },

      approvedAt: Date,

      rejectedAt: Date,

      rejectionReason: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PostReport",
  postReportSchema
);