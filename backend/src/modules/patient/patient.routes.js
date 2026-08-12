import { Router } from "express";

import patientController from "./patient.controller.js";

import protect from "../../middlewares/protect.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createPatientValidation,
  updatePatientValidation,
} from "./patient.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("doctor", "admin"),
  createPatientValidation,
  validate,
  patientController.create
);

router.get(
    "/",
    protect,
    authorize("doctor", "teamLeader", "admin"),
    patientController.getAll
);

router.get(
  "/dashboard",
  protect,
  authorize("doctor"),
  patientController.getDashboardStats
);

router.patch(
  "/:id",
  protect,
  authorize("doctor"),
  updatePatientValidation,
  validate,
  patientController.update
);

router.get(
  "/:id",
  protect,
  authorize("doctor", "teamLeader", "admin"),
  patientController.getById
);


export default router;
