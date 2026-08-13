import Patient from "./patient.model.js";
import AppError from "../../shared/errors/AppError.js";
import PreReport from "../preReport/preReport.model.js";
import PostReport from "../postReport/postReport.model.js";
import User from "../user/user.model.js"; // <-- Added User import

class PatientService {
  async create(data) {
    const existingPatient = await Patient.findOne({
      nationalId: data.nationalId,
      isActive: true,
    });

    if (existingPatient) {
      throw new AppError("Patient already exists.", 409);
    }

    return await Patient.create(data);
  }

  async findById(id) {
    return await Patient.findById(id).populate(
      "doctor",
      "firstName middleName lastName email role",
    );
  }

  async getAll(user, search) {
    const query = {
      isActive: true,
    };

    // Doctor can only see his patients
    if (user.role === "doctor") {
      query.doctor = user._id;
    }
    // Team Leader sees patients of doctors assigned to them
    else if (user.role === "teamLeader") {
      const myDoctors = await User.find({ teamLeader: user._id }).select("_id");
      const doctorIds = myDoctors.map((doc) => doc._id);
      query.doctor = { $in: doctorIds };
    }

    // Search by name or national ID
    if (search) {
      query.$or = [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          middleName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          nationalId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    return await Patient.find(query)
      .populate("doctor", "firstName middleName lastName")
      .sort({
        createdAt: -1,
      });
  }

  async getById(patientId, user) {
    let patient;

    if (user.role === "doctor") {
      patient = await Patient.findOne({
        _id: patientId,
        doctor: user._id,
        isActive: true,
      }).populate("doctor", "firstName middleName lastName email role");
    } else {
      patient = await Patient.findOne({
        _id: patientId,
        isActive: true,
      }).populate("doctor", "firstName middleName lastName email role");
    }

    if (!patient) {
      throw new AppError("Patient not found.", 404);
    }

    const preReports = await PreReport.find({
      patient: patientId,
    })
      .select("reportInformation approval createdAt teamLeader")
      .populate({
        path: "teamLeader",
        select: "firstName middleName lastName",
      })
      .sort({
        createdAt: -1,
      });

    const postReports = await PostReport.find({
      patient: patientId,
    })
      .select("beneficiaryInformation approval createdAt teamLeader")
      .populate({
        path: "teamLeader",
        select: "firstName middleName lastName",
      })
      .sort({
        createdAt: -1,
      });

    return {
      patient,
      preReports,
      postReports,
    };
  }

  async update(patientId, data, user) {
    const patient = await Patient.findOne({
      _id: patientId,
      doctor: user._id,
    });

    if (!patient) {
      throw new AppError("Patient not found.", 404);
    }

    // منع تكرار الرقم القومي
    if (data.nationalId && data.nationalId !== patient.nationalId) {
      const existingPatient = await Patient.findOne({
        nationalId: data.nationalId,
        _id: { $ne: patientId },
      });

      if (existingPatient) {
        throw new AppError("National ID already exists.", 409);
      }
    }

    Object.assign(patient, data);

    await patient.save();

    return patient.populate(
      "doctor",
      "firstName middleName lastName email role",
    );
  }

  async delete(patientId, user) {
  const patient = await Patient.findOne({
    _id: patientId,
    doctor: user._id,
    isActive: true,
  });

  if (!patient) {
    throw new AppError("Patient not found.", 404);
  }

  patient.isActive = false;

  await patient.save();

  return patient;
}

  async getDashboardStats(doctorId) {
    console.log("Doctor ID:", doctorId);

    const reports = await PreReport.find({
      doctor: doctorId,
    });

    console.log(reports);

    const [
      totalPatients,
      totalPreReports,
      totalPostReports,
      pendingPreReports,
      pendingPostReports,
    ] = await Promise.all([
      Patient.countDocuments({
        doctor: doctorId,
        isActive: true,
      }),
      PreReport.countDocuments({
        doctor: doctorId,
      }),
      PostReport.countDocuments({
        doctor: doctorId,
      }),
      PreReport.countDocuments({
        doctor: doctorId,
        "approval.status": "pending",
      }),
      PostReport.countDocuments({
        doctor: doctorId,
        "approval.status": "pending",
      }),
    ]);

    return {
      totalPatients,
      totalReports: totalPreReports + totalPostReports, // Fixed summation
      pendingReports: pendingPreReports + pendingPostReports, // Fixed summation
    };
  }
}

export default new PatientService();
