import { Routes, Route, Navigate } from "react-router-dom";

import Register from "../pages/auth/register";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import AdminLayout from "../features/Admin/layouts/AdminLayout";
import DoctorsadminPage from "../features/Admin/pages/Doctors/DoctorsadminPage";
import PatientsPage from "../features/Admin/pages/patients/PatientsPage";
import HeadsPage from "../features/Admin/pages/Heads/HeadsPage";

import DoctorLayout from "../features/Doctor/doctorlayout";
import CreatePatientPage from "../features/Doctor/CreatePatientPage";
import PatientProfilePage from "../features/Doctor/PatientProfilePage";
import BeneficiaryReportPage from "../features/reports/BeneficiaryReportPage";
import DoctorsPage from "../features/Doctor/Doctorpage";
import ReportPreviewPage from "../features/reports/ReportPreviewPage";
import PostReport from "../features/reports/postReportPreview";
import PostReportPage from "../features/reports/PostReportPage";

import TeamLeaderLayout from "../features/TeamLeader/TeamLeaderLayout";
import PendingReportsPage from "../features/TeamLeader/PendingReportsPage";
import TeamDoctorsPage from "../features/TeamLeader/TeamDoctorsPage";
import TeamPatientsPage from "../features/TeamLeader/TeamPatientsPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Footer from "../components/Footer";

export default function AppRouter() {
  return (
    // Wrap the entire app in a min-h-screen flex column layout
    <div className="flex min-h-screen flex-col bg-[#FCFEFD]">
      
      {/* This flex-1 container holds the main content and pushes the footer down */}
      <div className="flex flex-1 flex-col">
        <Routes>
          
          {/* ================= Authentication ================= */}
          {/* Properly wrapped in PublicRoute and AuthLayout is removed */}
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

          {/* ================= Admin ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirects /admin to /admin/doctors by default */}
            <Route index element={<Navigate to="doctors" replace />} />
            <Route path="doctors" element={<DoctorsadminPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="heads" element={<HeadsPage />} />
            <Route
    path="patient/:patientId"
    element={<PatientProfilePage />}
  />
            <Route
  path="/admin/pre-reports/:reportId"
  element={
    <ProtectedRoute roles={["admin"]}>
      <ReportPreviewPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/post-reports/:reportId"
  element={
    <ProtectedRoute roles={["admin"]}>
      <PostReport />
    </ProtectedRoute>
  }
/>
          </Route>

          {/* ================= Doctor ================= */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute roles={["doctor"]}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorsPage />} />
            <Route path="new" element={<CreatePatientPage />} />
            <Route path="edit-patient/:patientId" element={<CreatePatientPage />} />
            <Route path="patient/:patientId" element={<PatientProfilePage />} />
            <Route path="reports/beneficiary/:patientId" element={<BeneficiaryReportPage />} />
            <Route path="reports/secondary/:patientId" element={<PostReportPage />} />
          </Route>

          {/* Doctor Previews (WITHOUT Sidebar) */}
          <Route
            path="/doctor/pre-reports/:reportId"
            element={
              <ProtectedRoute roles={["doctor"]}>
                <ReportPreviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/post-reports/:reportId"
            element={
              <ProtectedRoute roles={["doctor"]}>
                <PostReport />
              </ProtectedRoute>
            }
          />

          {/* ================= Team Leader (WITH Sidebar) ================= */}
          <Route
            path="/team-leader"
            element={
              <ProtectedRoute roles={["teamLeader"]}>
                <TeamLeaderLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PendingReportsPage />} />
            <Route path="doctors" element={<TeamDoctorsPage />} />
            <Route path="patients" element={<TeamPatientsPage />} />
            <Route path="patient/:patientId" element={<PatientProfilePage />} />
          </Route>

          {/* ================= Team Leader (WITHOUT Sidebar - Previews) ================= */}
          <Route
            path="/team-leader/pre-reports/:reportId"
            element={
              <ProtectedRoute roles={["teamLeader"]}>
                <ReportPreviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-leader/post-reports/:reportId"
            element={
              <ProtectedRoute roles={["teamLeader"]}>
                <PostReport />
              </ProtectedRoute>
            }
          />

          {/* ================= CATCH-ALL ROUTE ================= */}
          {/* This MUST be the very last route in the file! */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>

      {/* ================= Global Footer ================= */}
      <Footer />

    </div>
  );
}