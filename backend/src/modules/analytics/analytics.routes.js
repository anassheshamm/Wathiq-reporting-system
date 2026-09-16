import { Router } from "express";

import analyticsController from "./analytics.controller.js";

import protect from "../../middlewares/protect.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  analyticsController.getDashboard
);

export default router;