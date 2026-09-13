import exportService from "./export.service.js";

class ExportController {
  async exportExcel(req, res, next) {
    try {
      const { from, to } = req.query;

      if (!from || !to) {
        return res.status(400).json({
          success: false,
          message: "from and to dates are required.",
        });
      }

      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (
        Number.isNaN(fromDate.getTime()) ||
        Number.isNaN(toDate.getTime())
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format.",
        });
      }

      if (fromDate > toDate) {
        return res.status(400).json({
          success: false,
          message: "The from date must be before the to date.",
        });
      }

      const workbook =
        await exportService.exportPatientsAndReports(
          from,
          to
        );

      const fileName =
        `تقرير_المستفيدين_${from}_إلى_${to}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
  "Content-Disposition",
  `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
);

      await workbook.xlsx.write(res);

      res.end();
    } catch (error) {
      next(error);
    }
  }
}

export default new ExportController();