import mongoose from "mongoose";
import { ROLES } from "../../constants/roles.js";

const userSchema = new mongoose.Schema(
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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    nationalId: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  immutable: true,
},

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    canInviteUsers: {
  type: Boolean,
  default: false,
},

    lastLogin: {
      type: Date,
      default: null,
    },

    invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },
    teamLeader: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;