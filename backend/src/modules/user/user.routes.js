import { Router } from "express";
import userController from "./user.controller.js";
import { createUserValidation } from "./user.validation.js";
import validate from "../../middlewares/validate.middleware.js";
import protect from "../../middlewares/protect.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/profile",
  protect,
  userController.getProfile
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createUserValidation,
  validate,
  userController.create
);

router.get(
  "/",
  protect,
  authorize("admin"),
  userController.getAll
);

router.get(
  "/team-leaders",
  protect,
  authorize("doctor", "admin"),
  userController.getTeamLeaders
);

// NEW ROUTE
router.get(
  "/my-team",
  protect,
  authorize("teamLeader"),
  userController.getMyTeam
);

export default router;