import ExcelJS from "exceljs";

import Patient from "../patient/patient.model.js";
import PreReport from "../preReport/preReport.model.js";
import PostReport from "../postReport/postReport.model.js";

/* ============================================================
   Translations
   ============================================================ */

const translations = {
  gender: {
    male: "ذكر",
    female: "أنثى",
  },

  maritalStatus: {
    single: "أعزب",
    married: "متزوج",
    divorced: "مطلق",
    widowed: "أرمل",
  },

  addictionSeverity: {
    mild: "خفيفة",
    moderate: "متوسطة",
    severe: "شديدة",
  },

  motivations: {
    personal: "شخصية",
    family: "عائلية",
    legal: "قانونية",
    other: "أخرى",
  },

  psychologicalStatus: {
    stable: "مستقرة",
    mild_disorder: "اضطراب بسيط",
    severe_disorder: "اضطراب شديد",

    significant_improvement: "تحسن ملحوظ",
    moderate_improvement: "تحسن متوسط",
    no_improvement: "لا يوجد تحسن",
  },

  behavioralStatus: {
    cooperative: "متعاون",
    hesitant: "متردد",
    aggressive: "عدواني",

    high_commitment: "التزام عالي",
    medium_commitment: "التزام متوسط",
    difficulty_commitment: "صعوبة في الالتزام",
  },

  programCommitment: {
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",

    fully_committed: "ملتزم بالكامل",
    partially_committed: "ملتزم جزئيًا",
    not_committed: "غير ملتزم",
  },

  socialStatus: {
    positive_interaction: "تفاعل إيجابي",
    limited_interaction: "تفاعل محدود",
    social_isolation: "عزلة اجتماعية",
  },

  overallImprovement: {
    excellent: "ممتاز",
    good: "جيد",
    limited: "محدود",
  },

  activityParticipation: {
    active: "نشط",
    average: "متوسط",
    weak: "ضعيف",
  },

  emotionalStability: {
    stable: "مستقر",
    fluctuating: "متذبذب",
    disturbed: "مضطرب",
  },

  familyRelationship: {
    improved: "تحسنت",
    unchanged: "لم تتغير",
    still_tense: "ما زالت متوترة",
  },

  communityReadiness: {
    ready: "جاهز",
    needs_support: "يحتاج دعم",
    not_ready: "غير جاهز",
  },

  recoveryStability: {
    very_good: "جيدة جدًا",
    acceptable: "مقبولة",
    weak: "ضعيفة",
  },

  personalPlanReadiness: {
    ready: "جاهز",
    under_development: "قيد التطوير",
    not_ready: "غير جاهز",
  },

  approvalStatus: {
    pending: "قيد المراجعة",
    approved: "معتمد",
    rejected: "مرفوض",
  },
  patientStatus: {
  active: "مستمر",
  completed: "مكتمل",
  delayed: "متعثر",
  discontinued: "منقطع",
},
};

/* ============================================================
   Translation Helpers
   ============================================================ */

const translate = (category, value) => {
  if (!value) {
    return "";
  }

  return translations[category]?.[value] || value;
};

const translateArray = (category, values = []) => {
  return values
    .map((value) => translate(category, value))
    .join("، ");
};

/* ============================================================
   Date Helper
   ============================================================ */

const formatDateValue = (value) => {
  if (!value) {
    return "";
  }

  return value;
};

/* ============================================================
   Excel Formatting
   ============================================================ */

const formatSheet = (sheet) => {
  // RTL + freeze first row
  sheet.views = [
    {
      state: "frozen",
      ySplit: 1,
      rightToLeft: true,
    },
  ];

  // Header formatting
  const headerRow = sheet.getRow(1);

  headerRow.height = 30;

  headerRow.font = {
    bold: true,
    size: 12,
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };

  // Filter
  sheet.autoFilter = {
    from: "A1",
    to: {
      row: 1,
      column: sheet.columnCount,
    },
  };

  // Body formatting
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    row.eachCell((cell) => {
      cell.alignment = {
        vertical: "top",
        horizontal: "right",
        wrapText: true,
      };

      if (cell.value instanceof Date) {
        cell.numFmt = "dd/mm/yyyy";
      }
    });
  });

  // Make rows readable
  sheet.eachRow((row) => {
    row.height = 22;
  });

  // Header height again after row formatting
  headerRow.height = 30;
};

/* ============================================================
   Export Service
   ============================================================ */

class ExportService {
  async exportPatientsAndReports(from, to) {
    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    /* ========================================================
       1. Get Patients
       ======================================================== */

    const patientsCreatedInPeriod = await Patient.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate(
      "doctor",
      "firstName middleName lastName email"
    );

    /* ========================================================
       2. Get Pre Reports
       ======================================================== */

    const preReports = await PreReport.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate(
        "patient",
        "firstName middleName lastName nationalId"
      )
      .populate(
        "doctor",
        "firstName middleName lastName"
      )
      .populate(
        "teamLeader",
        "firstName middleName lastName"
      );

    /* ========================================================
       3. Get Post Reports
       ======================================================== */

    const postReports = await PostReport.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate(
        "patient",
        "firstName middleName lastName nationalId"
      )
      .populate(
        "doctor",
        "firstName middleName lastName"
      )
      .populate(
        "teamLeader",
        "firstName middleName lastName"
      );

    /* ========================================================
       4. Collect All Related Patient IDs
       ======================================================== */

    const patientIds = new Set();

    // Patients created in selected period
    patientsCreatedInPeriod.forEach((patient) => {
      patientIds.add(patient._id.toString());
    });

    // Patients that have Pre Reports in selected period
    preReports.forEach((report) => {
      if (report.patient) {
        patientIds.add(report.patient._id.toString());
      }
    });

    // Patients that have Post Reports in selected period
    postReports.forEach((report) => {
      if (report.patient) {
        patientIds.add(report.patient._id.toString());
      }
    });

    /* ========================================================
       5. Get All Related Patients
       ======================================================== */

    const allPatients = await Patient.find({
      _id: {
        $in: [...patientIds],
      },
    }).populate(
      "doctor",
      "firstName middleName lastName email"
    );

    /* ========================================================
       6. Create Workbook
       ======================================================== */

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "نظام تقارير التعافي";
    workbook.lastModifiedBy = "نظام تقارير التعافي";
    workbook.created = new Date();
    workbook.modified = new Date();

    /* ========================================================
       7. Patients Sheet
       ======================================================== */

    const patientsSheet =
      workbook.addWorksheet("المستفيدون");

    patientsSheet.columns = [
      {
        header: "رقم المستفيد",
        key: "patientId",
        width: 28,
      },
      {
        header: "الاسم الأول",
        key: "firstName",
        width: 18,
      },
      {
        header: "الاسم الأوسط",
        key: "middleName",
        width: 18,
      },
      {
        header: "اسم العائلة",
        key: "lastName",
        width: 18,
      },
      {
        header: "رقم الهوية",
        key: "nationalId",
        width: 18,
      },
      {
        header: "الجنس",
        key: "gender",
        width: 12,
      },
      {
        header: "الجنسية",
        key: "nationality",
        width: 16,
      },
      {
        header: "المهنة",
        key: "occupation",
        width: 20,
      },
      {
        header: "الحالة الاجتماعية",
        key: "maritalStatus",
        width: 18,
      },
      {
        header: "تاريخ الميلاد",
        key: "dateOfBirth",
        width: 18,
      },
      {
        header: "رقم الهاتف",
        key: "phone",
        width: 18,
      },
      {
        header: "رقم الهاتف البديل",
        key: "alternativePhone",
        width: 20,
      },
      {
        header: "البريد الإلكتروني",
        key: "email",
        width: 30,
      },
      {
        header: "هاتف الطوارئ",
        key: "emergencyContactPhone",
        width: 22,
      },
      {
        header: "صلة القرابة",
        key: "emergencyContactRelation",
        width: 20,
      },
      {
        header: "العنوان",
        key: "address",
        width: 35,
      },
      {
        header: "المعالج",
        key: "doctor",
        width: 28,
      },
      {
  header: "الحالة",
  key: "status",
  width: 18,
},
      {
        header: "تاريخ إنشاء الملف",
        key: "createdAt",
        width: 20,
      },
      {
        header: "آخر تحديث",
        key: "updatedAt",
        width: 20,
      },
    ];

    allPatients.forEach((patient) => {
      patientsSheet.addRow({
        patientId: patient._id.toString(),

        firstName: patient.firstName,

        middleName: patient.middleName,

        lastName: patient.lastName,

        nationalId: patient.nationalId,

        gender: translate(
          "gender",
          patient.gender
        ),

        nationality: patient.nationality,

        occupation: patient.occupation || "",

        maritalStatus: translate(
          "maritalStatus",
          patient.maritalStatus
        ),

        dateOfBirth: formatDateValue(
          patient.dateOfBirth
        ),

        phone: patient.phone,

        alternativePhone:
          patient.alternativePhone || "",

        email: patient.email || "",

        emergencyContactPhone:
          patient.emergencyContactPhone || "",

        emergencyContactRelation:
          patient.emergencyContactRelation || "",

        address: patient.address || "",

        doctor: patient.doctor
          ? `${patient.doctor.firstName} ${patient.doctor.middleName} ${patient.doctor.lastName}`
          : "",

        status: translate(
  "patientStatus",
  patient.status
),

        createdAt: formatDateValue(
          patient.createdAt
        ),

        updatedAt: formatDateValue(
          patient.updatedAt
        ),
      });
    });

    /* ========================================================
       8. Pre Reports Sheet
       ======================================================== */

    const preReportsSheet =
      workbook.addWorksheet("التقارير الأولية");

    preReportsSheet.columns = [
      {
        header: "رقم التقرير",
        key: "reportId",
        width: 28,
      },
      {
        header: "رقم المستفيد",
        key: "patientId",
        width: 28,
      },
      {
        header: "رقم الهوية",
        key: "nationalId",
        width: 18,
      },
      {
        header: "اسم المستفيد",
        key: "patientName",
        width: 30,
      },
      {
        header: "المعالج",
        key: "doctor",
        width: 28,
      },
      {
        header: "قائد الفريق",
        key: "teamLeader",
        width: 28,
      },
      {
        header: "اسم البرنامج",
        key: "programName",
        width: 25,
      },
      {
        header: "تاريخ البداية",
        key: "startDate",
        width: 18,
      },
      {
        header: "شدة الإدمان",
        key: "addictionSeverity",
        width: 20,
      },
      {
        header: "نوع المادة السابقة",
        key: "previousSubstanceType",
        width: 25,
      },
      {
        header: "مدة الإدمان",
        key: "addictionDuration",
        width: 20,
      },
      {
        header: "محاولات التعافي السابقة",
        key: "previousRecoveryAttempts",
        width: 25,
      },
      {
        header: "الدوافع",
        key: "motivations",
        width: 30,
      },
      {
        header: "الحالة النفسية",
        key: "psychologicalStatus",
        width: 25,
      },
      {
        header: "الحالة السلوكية",
        key: "behavioralStatus",
        width: 25,
      },
      {
        header: "الالتزام بالبرنامج",
        key: "programCommitment",
        width: 22,
      },
      {
        header: "التوصيات",
        key: "recommendations",
        width: 40,
      },
      {
        header: "حالة الاعتماد",
        key: "approvalStatus",
        width: 18,
      },
      {
        header: "تاريخ التقديم",
        key: "submittedAt",
        width: 20,
      },
      {
        header: "تاريخ الاعتماد",
        key: "approvedAt",
        width: 20,
      },
      {
        header: "تاريخ الرفض",
        key: "rejectedAt",
        width: 20,
      },
      {
        header: "سبب الرفض",
        key: "rejectionReason",
        width: 30,
      },
      {
        header: "تاريخ إنشاء التقرير",
        key: "createdAt",
        width: 20,
      },
      {
        header: "آخر تحديث",
        key: "updatedAt",
        width: 20,
      },
    ];

    preReports.forEach((report) => {
      const patient = report.patient;

      preReportsSheet.addRow({
        reportId: report._id.toString(),

        patientId: patient
          ? patient._id.toString()
          : "",

        nationalId: patient?.nationalId || "",

        patientName: patient
          ? `${patient.firstName} ${patient.middleName} ${patient.lastName}`
          : "",

        doctor: report.doctor
          ? `${report.doctor.firstName} ${report.doctor.middleName} ${report.doctor.lastName}`
          : "",

        teamLeader: report.teamLeader
          ? `${report.teamLeader.firstName} ${report.teamLeader.middleName} ${report.teamLeader.lastName}`
          : "",

        programName:
          report.reportInformation?.programName || "",

        startDate:
          formatDateValue(
            report.reportInformation?.startDate
          ),

        addictionSeverity: translate(
          "addictionSeverity",
          report.generalCaseInformation
            ?.addictionSeverity
        ),

        previousSubstanceType:
          report.generalCaseInformation
            ?.previousSubstanceType || "",

        addictionDuration:
          report.generalCaseInformation
            ?.addictionDuration || "",

        previousRecoveryAttempts:
          report.generalCaseInformation
            ?.previousRecoveryAttempts ?? 0,

        motivations: translateArray(
          "motivations",
          report.generalCaseInformation
            ?.motivations
        ),

        psychologicalStatus: translate(
          "psychologicalStatus",
          report.initialEvaluations
            ?.psychologicalStatus
        ),

        behavioralStatus: translate(
          "behavioralStatus",
          report.initialEvaluations
            ?.behavioralStatus
        ),

        programCommitment: translate(
          "programCommitment",
          report.initialEvaluations
            ?.programCommitment
        ),

        recommendations:
          report.initialRecommendations
            ?.recommendations || "",

        approvalStatus: translate(
          "approvalStatus",
          report.approval?.status
        ),

        submittedAt:
          formatDateValue(
            report.approval?.submittedAt
          ),

        approvedAt:
          formatDateValue(
            report.approval?.approvedAt
          ),

        rejectedAt:
          formatDateValue(
            report.approval?.rejectedAt
          ),

        rejectionReason:
          report.approval?.rejectionReason || "",

        createdAt: formatDateValue(
          report.createdAt
        ),

        updatedAt: formatDateValue(
          report.updatedAt
        ),
      });
    });

    /* ========================================================
       9. Post Reports Sheet
       ======================================================== */

    const postReportsSheet =
      workbook.addWorksheet("التقارير النهائية");

    postReportsSheet.columns = [
      {
        header: "رقم التقرير",
        key: "reportId",
        width: 28,
      },
      {
        header: "رقم المستفيد",
        key: "patientId",
        width: 28,
      },
      {
        header: "رقم الهوية",
        key: "nationalId",
        width: 18,
      },
      {
        header: "اسم المستفيد",
        key: "patientName",
        width: 30,
      },
      {
        header: "المعالج",
        key: "doctor",
        width: 28,
      },
      {
        header: "قائد الفريق",
        key: "teamLeader",
        width: 28,
      },
      {
        header: "اسم البرنامج",
        key: "programName",
        width: 25,
      },
      {
        header: "اسم المرشد",
        key: "counselorName",
        width: 25,
      },
      {
        header: "تاريخ البداية",
        key: "startDate",
        width: 18,
      },
      {
        header: "تاريخ التخرج",
        key: "graduationDate",
        width: 18,
      },
      {
        header: "شدة الإدمان",
        key: "addictionSeverity",
        width: 20,
      },
      {
        header: "ملخص الحالة",
        key: "caseSummary",
        width: 40,
      },
      {
        header: "الحالة النفسية",
        key: "psychologicalStatus",
        width: 25,
      },
      {
        header: "الحالة السلوكية",
        key: "behavioralStatus",
        width: 25,
      },
      {
        header: "الحالة الاجتماعية",
        key: "socialStatus",
        width: 25,
      },
      {
        header: "التحسن العام",
        key: "overallImprovement",
        width: 22,
      },
      {
        header: "الالتزام بالعلاج",
        key: "treatmentCommitment",
        width: 24,
      },
      {
        header: "المشاركة في الأنشطة",
        key: "activityParticipation",
        width: 24,
      },
      {
        header: "الاستقرار العاطفي",
        key: "emotionalStability",
        width: 22,
      },
      {
        header: "العلاقة الأسرية",
        key: "familyRelationship",
        width: 22,
      },
      {
        header: "الاستعداد للمجتمع",
        key: "communityReadiness",
        width: 22,
      },
      {
        header: "استقرار التعافي",
        key: "recoveryStability",
        width: 22,
      },
      {
        header: "الاستعداد للخطة الشخصية",
        key: "personalPlanReadiness",
        width: 25,
      },
      {
        header: "ملاحظات الأسرة",
        key: "familyNotification",
        width: 35,
      },
      {
        header: "التوصيات",
        key: "recommendations",
        width: 40,
      },
      {
        header: "ملاحظات إضافية",
        key: "additionalNotes",
        width: 40,
      },
      {
        header: "حالة الاعتماد",
        key: "approvalStatus",
        width: 18,
      },
      {
        header: "تاريخ الاعتماد",
        key: "approvedAt",
        width: 20,
      },
      {
        header: "تاريخ الرفض",
        key: "rejectedAt",
        width: 20,
      },
      {
        header: "سبب الرفض",
        key: "rejectionReason",
        width: 30,
      },
      {
        header: "تاريخ إنشاء التقرير",
        key: "createdAt",
        width: 20,
      },
      {
        header: "آخر تحديث",
        key: "updatedAt",
        width: 20,
      },
    ];

    postReports.forEach((report) => {
      const patient = report.patient;

      postReportsSheet.addRow({
        reportId: report._id.toString(),

        patientId: patient
          ? patient._id.toString()
          : "",

        nationalId: patient?.nationalId || "",

        patientName: patient
          ? `${patient.firstName} ${patient.middleName} ${patient.lastName}`
          : "",

        doctor: report.doctor
          ? `${report.doctor.firstName} ${report.doctor.middleName} ${report.doctor.lastName}`
          : "",

        teamLeader: report.teamLeader
          ? `${report.teamLeader.firstName} ${report.teamLeader.middleName} ${report.teamLeader.lastName}`
          : "",

        programName:
          report.beneficiaryInformation
            ?.programName || "",

        counselorName:
          report.beneficiaryInformation
            ?.counselorName || "",

        startDate:
          formatDateValue(
            report.beneficiaryInformation
              ?.startDate
          ),

        graduationDate:
          formatDateValue(
            report.beneficiaryInformation
              ?.graduationDate
          ),

        addictionSeverity: translate(
          "addictionSeverity",
          report.caseSummary
            ?.addictionSeverity
        ),

        caseSummary:
          report.caseSummary?.summary || "",

        psychologicalStatus: translate(
          "psychologicalStatus",
          report.progressAssessment
            ?.psychologicalStatus
        ),

        behavioralStatus: translate(
          "behavioralStatus",
          report.progressAssessment
            ?.behavioralStatus
        ),

        socialStatus: translate(
          "socialStatus",
          report.progressAssessment
            ?.socialStatus
        ),

        overallImprovement: translate(
          "overallImprovement",
          report.programProgress
            ?.overallImprovement
        ),

        treatmentCommitment: translate(
          "programCommitment",
          report.programProgress
            ?.treatmentCommitment
        ),

        activityParticipation: translate(
          "activityParticipation",
          report.programProgress
            ?.activityParticipation
        ),

        emotionalStability: translate(
          "emotionalStability",
          report.programProgress
            ?.emotionalStability
        ),

        familyRelationship: translate(
          "familyRelationship",
          report.programProgress
            ?.familyRelationship
        ),

        communityReadiness: translate(
          "communityReadiness",
          report.programProgress
            ?.communityReadiness
        ),

        recoveryStability: translate(
          "recoveryStability",
          report.recoveryStability
        ),

        personalPlanReadiness: translate(
          "personalPlanReadiness",
          report.personalPlanReadiness
        ),

        familyNotification:
          report.familyNotification
            ?.notes || "",

        recommendations:
          report.recommendations || "",

        additionalNotes:
          report.additionalNotes || "",

        approvalStatus: translate(
          "approvalStatus",
          report.approval?.status
        ),

        approvedAt:
          formatDateValue(
            report.approval?.approvedAt
          ),

        rejectedAt:
          formatDateValue(
            report.approval?.rejectedAt
          ),

        rejectionReason:
          report.approval?.rejectionReason || "",

        createdAt: formatDateValue(
          report.createdAt
        ),

        updatedAt: formatDateValue(
          report.updatedAt
        ),
      });
    });

    /* ========================================================
       10. Format All Sheets
       ======================================================== */

    formatSheet(patientsSheet);
    formatSheet(preReportsSheet);
    formatSheet(postReportsSheet);

    /* ========================================================
       11. Return Workbook
       ======================================================== */

    return workbook;
  }
}

export default new ExportService();