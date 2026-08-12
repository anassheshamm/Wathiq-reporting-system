import { Router } from "express";
import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import patientRoutes from "./modules/patient/patient.routes.js";
import invitationRoutes from "./modules/invitation/invitation.routes.js";
import preReportRoutes from "./modules/preReport/preReport.routes.js";
import postReportRoutes from "./modules/postReport/postReport.routes.js";
const router = Router();


router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Recovery Reporting System API is running.",
  });
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/invitations", invitationRoutes);
router.use("/pre-reports", preReportRoutes);
router.use(
  "/post-reports",
  postReportRoutes
);
export default router;
