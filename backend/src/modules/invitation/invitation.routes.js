import { Router } from "express";

import invitationController from "./invitation.controller.js";

import protect from "../../middlewares/protect.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import { createInvitationValidation } from "./invitation.validation.js";
import canInviteUsers from "../../middlewares/canInviteUsers.middleware.js";

const router = Router();

// router.post(
//   "/",
//   protect,
//   authorize("admin"),
//   createInvitationValidation,
//   validate,
//   invitationController.create
// );

router.post(
  "/",
  protect,
  authorize("admin"),
  canInviteUsers,
  createInvitationValidation,
  validate,
  invitationController.create
);

router.get(
  "/verify/:token",
  invitationController.verify
);

export default router;