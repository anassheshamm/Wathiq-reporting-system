import { Router } from "express";

import preReportController from "./preReport.controller.js";

import { createPreReportValidation,rejectPreReportValidation} from "./preReport.validation.js";

import validate from "../../middlewares/validate.middleware.js";
import protect from "../../middlewares/protect.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("doctor"),
  createPreReportValidation,
  validate,
  preReportController.create
);

router.get(
  "/my-reports",
  protect,
  authorize("doctor"),
  preReportController.getMyReports
);

router.get(
  "/pending",
  protect,
  authorize("teamLeader"),
  preReportController.getPending
);

router.get(
  "/patient/:patientId",
  protect,
  authorize("doctor", "teamLeader", "admin"),
  preReportController.getByPatient
);

router.get(
  "/:id",
  protect,
  authorize("doctor", "teamLeader", "admin"),
  preReportController.getById
);

router.patch(
  "/:id/approve",
  protect,
  authorize("teamLeader"),
  preReportController.approve
);

router.patch(
  "/:id/reject",
  protect,
  authorize("teamLeader"),
  rejectPreReportValidation,
  validate,
  preReportController.reject
);

export default router;