import postReportService from "./postReport.service.js";

class PostReportController {
  async create(req, res, next) {
    try {
      const report = await postReportService.create(
        req.body,
        req.user._id
      );

      return res.status(201).json({
        success: true,
        message: "Post-report submitted successfully.",
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPending(req, res, next) {
    try {
      const reports =
        await postReportService.getPendingReports(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const report =
        await postReportService.approve(
          req.params.id,
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          "Post-report approved successfully.",
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const report =
        await postReportService.reject(
          req.params.id,
          req.user._id,
          req.body.reason
        );

      return res.status(200).json({
        success: true,
        message:
          "Post-report rejected successfully.",
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyReports(req, res, next) {
    try {
      const reports =
        await postReportService.getMyReports(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const report =
        await postReportService.getById(
          req.params.id,
          req.user
        );

      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PostReportController();