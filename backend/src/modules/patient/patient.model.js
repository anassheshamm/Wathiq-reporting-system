import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    nationalId: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    nationality: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
    },

    maritalStatus: {
      type: String,
      enum: [
        "single",
        "married",
        "divorced",
        "widowed",
      ],
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    alternativePhone: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
    },

    emergencyContactRelation: {
      type: String,
    },

    address: {
      type: String,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
patientSchema.index(
  { nationalId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true,
    },
  }
);

export default mongoose.model("Patient", patientSchema);