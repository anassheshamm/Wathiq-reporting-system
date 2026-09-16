import analyticsService from "./analytics.service.js";

class AnalyticsController {
  async getDashboard(req, res, next) {
    try {
      const { from, to } = req.query;

      // ==========================================
      // Required dates
      // ==========================================

      if (!from || !to) {
        return res.status(400).json({
          success: false,
          message: "from and to dates are required.",
        });
      }

      // ==========================================
      // Validate date format
      // ==========================================

      const startDate = new Date(from);
      const endDate = new Date(to);

      if (Number.isNaN(startDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid from date.",
        });
      }

      if (Number.isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid to date.",
        });
      }

      // ==========================================
      // Validate date range
      // ==========================================

      if (startDate > endDate) {
        return res.status(400).json({
          success: false,
          message:
            "The from date must be before or equal to the to date.",
        });
      }

      // ==========================================
      // Analytics
      // ==========================================

      const data =
        await analyticsService.getDashboardSummary(
          from,
          to
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();