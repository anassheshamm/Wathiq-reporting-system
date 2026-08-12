import { Router } from "express";

import postReportController from "./postReport.controller.js";

import {
  createPostReportValidation,
  rejectPostReportValidation,
} from "./postReport.validation.js";

import validate from "../../middlewares/validate.middleware.js";
import protect from "../../middlewares/protect.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("doctor"),
  createPostReportValidation,
  validate,
  postReportController.create
);

router.get(
  "/my-reports",
  protect,
  authorize("doctor"),
  postReportController.getMyReports
);

router.get(
  "/pending",
  protect,
  authorize("teamLeader"),
  postReportController.getPending
);

router.get(
  "/:id",
  protect,
  authorize(
    "doctor",
    "teamLeader",
    "admin"
  ),
  postReportController.getById
);

router.patch(
  "/:id/approve",
  protect,
  authorize("teamLeader"),
  postReportController.approve
);

router.patch(
  "/:id/reject",
  protect,
  authorize("teamLeader"),
  rejectPostReportValidation,
  validate,
  postReportController.reject
);

export default router;