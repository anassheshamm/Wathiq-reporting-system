import { Router } from "express";
import exportController from "./export.controller.js";
import protect from "../../middlewares/protect.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/excel",
  protect,
  // Pass additional roles to the authorize middleware
  authorize("admin", "doctor", "teamLeader"), 
  exportController.exportExcel
);

export default router;