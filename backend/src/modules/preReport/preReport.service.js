import PreReport from "./preReport.model.js";
import Patient from "../patient/patient.model.js";
import User from "../user/user.model.js";
import AppError from "../../shared/errors/AppError.js";

class PreReportService {
  async create(data, doctorId) {
    const patient = await Patient.findById(data.patient);

    if (!patient) {
      throw new AppError("Patient not found.", 404);
    }
    
    // Check if the selected team leader exists
    const teamLeader = await User.findById(data.teamLeader);

    if (!teamLeader) {
      throw new AppError("Team leader not found.", 404);
    }
    
    // Verify the selected user is a team leader
    if (teamLeader.role !== "teamLeader") {
      throw new AppError("Selected user is not a team leader.", 400);
    }

    const existingReport = await PreReport.findOne({
      patient: patient._id,
    });

    if (existingReport) {
      throw new AppError(
        "A pre-report already exists for this patient.",
        409
      );
    }

    const report = await PreReport.create({
      patient: patient._id,
      doctor: doctorId,
      teamLeader: teamLeader._id,
      reportInformation: data.reportInformation,
      generalCaseInformation: data.generalCaseInformation,
      initialEvaluations: data.initialEvaluations,
      initialRecommendations: data.initialRecommendations,
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

  async getByPatientId(patientId) {
    const reports = await PreReport.find({ patient: patientId })
      .populate({ path: "teamLeader", select: "firstName lastName" })
      .sort({ createdAt: -1 }); // Newest first
    return reports;
  }

  async getPendingReports(teamLeaderId) {
    const reports = await PreReport.find({
      teamLeader: teamLeaderId,
      "approval.status": "pending",
    })
      .populate({
        path: "patient",
      })
      .populate({
        path: "doctor",
        select: "-password",
      })
      .sort({ createdAt: -1 });

    return reports;
  }

  async approve(reportId, teamLeaderId) {
    console.log("Report ID:", reportId);

    const report = await PreReport.findById(reportId);
    console.log("Report:", report);

    if (!report) {
      throw new AppError("Pre-report not found.", 404);
    }

    // Only the assigned team leader can approve
    if (report.teamLeader.toString() !== teamLeaderId.toString()) {
      throw new AppError(
        "You are not authorized to approve this report.",
        403
      );
    }

    // Report must still be pending
    if (report.approval.status !== "pending") {
      throw new AppError(
        "This report has already been processed.",
        400
      );
    }

    report.approval.status = "approved";
    report.approval.approvedAt = new Date();

    await report.save();

    // ==========================================
    // NEW: Auto-Assign Doctor to Team Leader
    // ==========================================
    const doctor = await User.findById(report.doctor);
    if (doctor && !doctor.teamLeader) {
      doctor.teamLeader = teamLeaderId;
      await doctor.save();
    }

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

  async reject(reportId, teamLeaderId, reason) {
    const report = await PreReport.findById(reportId);

    if (!report) {
      throw new AppError("Pre-report not found.", 404);
    }

    if (report.teamLeader.toString() !== teamLeaderId.toString()) {
      throw new AppError(
        "You are not authorized to reject this report.",
        403
      );
    }

    if (report.approval.status !== "pending") {
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

  async getMyReports(doctorId) {
    const reports = await PreReport.find({
      doctor: doctorId,
    })
      .populate({
        path: "patient",
        select: "firstName middleName lastName nationalId",
      })
      .populate({
        path: "teamLeader",
        select: "firstName lastName email",
      })
      .sort({
        createdAt: -1,
      });

    return reports;
  }

  async getById(reportId, user) {
    const report = await PreReport.findById(reportId)
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
      throw new AppError("Pre-report not found.", 404);
    }

    // Doctor can only view reports he created
    if (
      user.role === "doctor" &&
      report.doctor._id.toString() !== user._id.toString()
    ) {
      throw new AppError(
        "You are not authorized to view this report.",
        403
      );
    }

    // Team leader can only view reports assigned to him
    if (
      user.role === "teamLeader" &&
      report.teamLeader._id.toString() !== user._id.toString()
    ) {
      throw new AppError(
        "You are not authorized to view this report.",
        403
      );
    }

    return report;
  }
}

export default new PreReportService();