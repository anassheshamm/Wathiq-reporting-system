import preReportService from "./preReport.service.js";

class PreReportController {
  async create(req, res, next) {
    try {
      const report = await preReportService.create(
        req.body,
        req.user._id
      );

      return res.status(201).json({
        success: true,
        message: "Pre-report submitted successfully.",
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

   async getByPatient(req, res, next) {
    try {
      const reports = await preReportService.getByPatientId(req.params.patientId);
      return res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
    }
   }


  async getPending(req, res, next) {
  try {
    const reports = await preReportService.getPendingReports(req.user._id);

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
    const report = await preReportService.approve(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Pre-report approved successfully.",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

async reject(req, res, next) {
  try {
    const report = await preReportService.reject(
      req.params.id,
      req.user._id,
      req.body.reason
    );

    return res.status(200).json({
      success: true,
      message: "Pre-report rejected successfully.",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

async getMyReports(req, res, next) {
  try {
    const reports = await preReportService.getMyReports(req.user._id);

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
    const report = await preReportService.getById(
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

export default new PreReportController();