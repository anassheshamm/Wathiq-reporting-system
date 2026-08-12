import PostReport from "./postReport.model.js";
import PreReport from "../preReport/preReport.model.js";

import Patient from "../patient/patient.model.js";
import User from "../user/user.model.js";

import AppError from "../../shared/errors/AppError.js";

class PostReportService {
  async create(data, doctorId) {
    // ============================================================
    // Check Patient
    // ============================================================

    const patient = await Patient.findById(data.patient);

    if (!patient) {
      throw new AppError("Patient not found.", 404);
    }

    // ============================================================
    // Check Team Leader
    // ============================================================

    const teamLeader = await User.findById(data.teamLeader);

    if (!teamLeader) {
      throw new AppError("Team leader not found.", 404);
    }

    if (teamLeader.role !== "teamLeader") {
      throw new AppError(
        "Selected user is not a team leader.",
        400
      );
    }

    // ============================================================
    // Pre Report must exist
    // ============================================================

    const preReport = await PreReport.findOne({
      patient: patient._id,
    });

    if (!preReport) {
      throw new AppError(
        "Pre-report not found for this patient.",
        404
      );
    }

    if (preReport.approval.status !== "approved") {
      throw new AppError(
        "Pre-report must be approved before creating a post-report.",
        400
      );
    }

    // ============================================================
    // Prevent Duplicate
    // ============================================================

    const existingReport = await PostReport.findOne({
      patient: patient._id,
    });

    if (existingReport) {
      throw new AppError(
        "A post-report already exists for this patient.",
        409
      );
    }

    // ============================================================
    // Create Report
    // ============================================================

    const report = await PostReport.create({
      patient: patient._id,

      doctor: doctorId,

      teamLeader: teamLeader._id,

      beneficiaryInformation:
        data.beneficiaryInformation,

      caseSummary: data.caseSummary,

      progressAssessment:
        data.progressAssessment,

      programProgress:
        data.programProgress,

      recoveryStability:
        data.recoveryStability,

      personalPlanReadiness:
        data.personalPlanReadiness,

      familyNotification:
        data.familyNotification,

      recommendations:
        data.recommendations,

      additionalNotes:
        data.additionalNotes,
    });

    await report.populate([
      {
        path: "patient",
      },
      {
        path: "doctor",
        select: "-password",
      },
      {
        path: "teamLeader",
        select: "-password",
      },
    ]);

    return report;
  }

  // ============================================================
  // Pending Reports
  // ============================================================

  async getPendingReports(teamLeaderId) {
    const reports = await PostReport.find({
      teamLeader: teamLeaderId,
      "approval.status": "pending",
    })
      .populate("patient")
      .populate({
        path: "doctor",
        select: "-password",
      })
      .sort({
        createdAt: -1,
      });

    return reports;
  }

  // ============================================================
  // Approve
  // ============================================================

  async approve(reportId, teamLeaderId) {
    const report =
      await PostReport.findById(reportId);

    if (!report) {
      throw new AppError(
        "Post-report not found.",
        404
      );
    }

    if (
      report.teamLeader.toString() !==
      teamLeaderId.toString()
    ) {
      throw new AppError(
        "You are not authorized to approve this report.",
        403
      );
    }

    if (
      report.approval.status !== "pending"
    ) {
      throw new AppError(
        "This report has already been processed.",
        400
      );
    }

    report.approval.status = "approved";
    report.approval.approvedAt = new Date();

    await report.save();

    await report.populate([
      {
        path: "patient",
      },
      {
        path: "doctor",
        select: "-password",
      },
      {
        path: "teamLeader",
        select: "-password",
      },
    ]);

    return report;
  }
    // ============================================================
  // Reject
  // ============================================================

  async reject(reportId, teamLeaderId, reason) {
    const report = await PostReport.findById(reportId);

    if (!report) {
      throw new AppError(
        "Post-report not found.",
        404
      );
    }

    if (
      report.teamLeader.toString() !==
      teamLeaderId.toString()
    ) {
      throw new AppError(
        "You are not authorized to reject this report.",
        403
      );
    }

    if (
      report.approval.status !== "pending"
    ) {
      throw new AppError(
        "This report has already been processed.",
        400
      );
    }

    report.approval.status = "rejected";
    report.approval.rejectedAt = new Date();
    report.approval.rejectionReason = reason;

    await report.save();

    await report.populate([
      {
        path: "patient",
      },
      {
        path: "doctor",
        select: "-password",
      },
      {
        path: "teamLeader",
        select: "-password",
      },
    ]);

    return report;
  }

  // ============================================================
  // Doctor Reports
  // ============================================================

  async getMyReports(doctorId) {
    const reports = await PostReport.find({
      doctor: doctorId,
    })
      .populate({
        path: "patient",
        select:
          "firstName middleName lastName nationalId",
      })
      .populate({
        path: "teamLeader",
        select:
          "firstName lastName email",
      })
      .sort({
        createdAt: -1,
      });

    return reports;
  }

  // ============================================================
  // Get By Id
  // ============================================================

  async getById(reportId, user) {
    const report = await PostReport.findById(
      reportId
    )
      .populate({
        path: "patient",
      })
      .populate({
        path: "doctor",
        select: "-password",
      })
      .populate({
        path: "teamLeader",
        select: "-password",
      });

    if (!report) {
      throw new AppError(
        "Post-report not found.",
        404
      );
    }

    // Doctor
    if (
      user.role === "doctor" &&
      report.doctor._id.toString() !==
        user._id.toString()
    ) {
      throw new AppError(
        "You are not authorized to view this report.",
        403
      );
    }

    // Team Leader
    if (
      user.role === "teamLeader" &&
      report.teamLeader._id.toString() !==
        user._id.toString()
    ) {
      throw new AppError(
        "You are not authorized to view this report.",
        403
      );
    }

    return report;
  }
}

export default new PostReportService();