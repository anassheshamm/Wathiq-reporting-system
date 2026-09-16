import Patient from "../patient/patient.model.js";
import PreReport from "../preReport/preReport.model.js";
import PostReport from "../postReport/postReport.model.js";

class AnalyticsService {
  async getDashboardSummary(from, to) {
    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    // ==========================================
    // PATIENTS
    // ==========================================

    const patientFilter = {
      createdAt: {
        $lte: endDate,
      },
    };

const [
  totalPatients,
  newPatients,
  activePatients,
  completedPatients,
  delayedPatients,
  discontinuedPatients,
] = await Promise.all([
  Patient.countDocuments(patientFilter),

  Patient.countDocuments({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }),

  Patient.countDocuments({
    ...patientFilter,
    status: "active",
  }),

  Patient.countDocuments({
    ...patientFilter,
    status: "completed",
  }),

  Patient.countDocuments({
    ...patientFilter,
    status: "delayed",
  }),

  Patient.countDocuments({
    ...patientFilter,
    status: "discontinued",
  }),
]);

// ==========================================
// RECOVERY DURATION
//
// Recovery journey:
//
// PreReport
//     ↓
// Treatment period
//     ↓
// PostReport
//
// Recovery duration =
// PreReport.createdAt → PostReport.createdAt
//
// Every PostReport represents one completed
// recovery case.
// ==========================================

const preReports = await PreReport.find({
  createdAt: {
    $lte: endDate,
  },
})
  .select("patient createdAt")
  .sort({ createdAt: 1 })
  .lean();

const postReports = await PostReport.find({
  createdAt: {
    $lte: endDate,
  },
})
  .select("patient createdAt")
  .sort({ createdAt: 1 })
  .lean();

// ==========================================
// GROUP PRE REPORTS BY PATIENT
// ==========================================

const preReportsByPatient = new Map();

for (const report of preReports) {
  const patientId = report.patient.toString();

  if (!preReportsByPatient.has(patientId)) {
    preReportsByPatient.set(patientId, []);
  }

  preReportsByPatient.get(patientId).push(report);
}

// ==========================================
// CALCULATE RECOVERY DURATIONS
// ==========================================

const recoveryDurations = [];

for (const postReport of postReports) {
  const patientId = postReport.patient.toString();

  const patientPreReports =
    preReportsByPatient.get(patientId);

  if (!patientPreReports?.length) {
    continue;
  }

  // Find the latest PreReport before this PostReport.
  const matchingPreReport = [...patientPreReports]
    .reverse()
    .find(
      (preReport) =>
        preReport.createdAt < postReport.createdAt
    );

  if (!matchingPreReport) {
    continue;
  }

  const durationMs =
    postReport.createdAt.getTime() -
    matchingPreReport.createdAt.getTime();

  const durationMonths =
    durationMs /
    (1000 * 60 * 60 * 24 * 30.4375);

  recoveryDurations.push(durationMonths);
}

// ==========================================
// AVERAGE RECOVERY DURATION
//
// Uses the exact same completed recovery
// cases used by the distribution.
// ==========================================

const averageRecoveryDuration =
  recoveryDurations.length > 0
    ? recoveryDurations.reduce(
        (sum, duration) => sum + duration,
        0
      ) / recoveryDurations.length
    : 0;


    // ==========================================
    // MONTHLY REPORTS
    // ==========================================

    const monthlyReports = await this.getMonthlyReports(
      startDate,
      endDate
    );

    // ==========================================
    // PATIENTS BY DOCTOR
    // ==========================================

    const patientsByDoctor =
      await this.getPatientsByDoctor(endDate);

    // ==========================================
    // RECOVERY DURATION DISTRIBUTION
    // ==========================================

    const recoveryDurationDistribution =
      this.getRecoveryDurationDistribution(
        recoveryDurations
      );

    // ==========================================
    // FINAL RESPONSE
    // ==========================================

    return {
      totalPatients,

      newPatients,

      activePatients,

      completedPatients,

      delayedPatients,

      discontinuedPatients,

      averageRecoveryDuration: Number(
        averageRecoveryDuration.toFixed(1)
      ),

      monthlyReports,

      patientsByDoctor,

      recoveryDurationDistribution,
    };
  }

// ==========================================
// MONTHLY REPORTS + NEW PATIENTS
// ==========================================

async getMonthlyReports(startDate, endDate) {
  const [preReports, postReports, patients] =
    await Promise.all([
      PreReport.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .select("createdAt")
        .lean(),

      PostReport.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .select("createdAt")
        .lean(),

      Patient.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .select("createdAt")
        .lean(),
    ]);

  const monthlyReportsMap = new Map();

  const currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );

  const lastDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    1
  );

  // ==========================================
  // CREATE ALL MONTHS
  // ==========================================

  while (currentDate <= lastDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const key = `${year}-${String(
      month + 1
    ).padStart(2, "0")}`;

    monthlyReportsMap.set(key, {
      key,

      month: new Intl.DateTimeFormat("ar-SA", {
        month: "long",
      }).format(currentDate),

      year,

      reportCount: 0,

      newPatients: 0,
    });

    currentDate.setMonth(
      currentDate.getMonth() + 1
    );
  }

  // ==========================================
  // COUNT PREREPORTS
  // ==========================================

  for (const report of preReports) {
    const date = new Date(report.createdAt);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const month = monthlyReportsMap.get(key);

    if (month) {
      month.reportCount += 1;
    }
  }

  // ==========================================
  // COUNT POSTREPORTS
  // ==========================================

  for (const report of postReports) {
    const date = new Date(report.createdAt);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const month = monthlyReportsMap.get(key);

    if (month) {
      month.reportCount += 1;
    }
  }

  // ==========================================
  // COUNT NEW PATIENTS
  // ==========================================

  for (const patient of patients) {
    const date = new Date(patient.createdAt);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const month = monthlyReportsMap.get(key);

    if (month) {
      month.newPatients += 1;
    }
  }

  // ==========================================
  // FINAL MONTHLY DATA
  // ==========================================

  return Array.from(
    monthlyReportsMap.values()
  ).map(
    ({
      key,
      month,
      year,
      reportCount,
      newPatients,
    }) => ({
      key,
      month,
      year,
      reportCount,
      newPatients,
    })
  );
}

  // ==========================================
  // PATIENTS BY DOCTOR
  // ==========================================

  async getPatientsByDoctor(endDate) {
    const patients = await Patient.find({
      createdAt: {
        $lte: endDate,
      },
    })
      .select("doctor")
      .populate(
        "doctor",
        "firstName middleName lastName"
      )
      .lean();

    const doctorsMap = new Map();

    for (const patient of patients) {
      if (!patient.doctor) {
        continue;
      }

      const doctorId =
        patient.doctor._id.toString();

      if (!doctorsMap.has(doctorId)) {
        doctorsMap.set(doctorId, {
          doctorId,

          doctorName: [
            patient.doctor.firstName,
            patient.doctor.middleName,
            patient.doctor.lastName,
          ]
            .filter(Boolean)
            .join(" "),

          count: 0,
        });
      }

      doctorsMap.get(doctorId).count += 1;
    }

    return Array.from(
      doctorsMap.values()
    ).sort(
      (a, b) => b.count - a.count
    );
  }

  // ==========================================
  // RECOVERY DURATION DISTRIBUTION
  //
  // Example:
  //
  // 1 month  -> 5 patients
  // 2 months -> 12 patients
  // 3 months -> 18 patients
  // 4 months -> 25 patients
  // ...
  // 12+      -> 3 patients
  // ==========================================

  getRecoveryDurationDistribution(
    recoveryDurations
  ) {
    const distribution = [];

    // Create buckets from 1 to 12+
    for (let month = 1; month <= 12; month++) {
      distribution.push({
        month,
        count: 0,
      });
    }

    // Put each recovery case into its bucket
    for (const duration of recoveryDurations) {
      const roundedMonths = Math.ceil(duration);

      if (roundedMonths >= 12) {
        distribution[11].count += 1;
        continue;
      }

      if (roundedMonths <= 1) {
        distribution[0].count += 1;
        continue;
      }

      distribution[roundedMonths - 1].count += 1;
    }

    return distribution;
  }
}

export default new AnalyticsService();