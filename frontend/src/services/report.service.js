import api from "./api";

class ReportService {
  // ================= Pre-Reports =================
  createPreReport(data) {
    return api.post("/pre-reports", data);
  }
  getPreReport(id) {
    return api.get(`/pre-reports/${id}`);
  }
  getReportsByPatient(patientId) {
    return api.get(`/pre-reports/patient/${patientId}`);
  }
  getPendingPreReports() {
    return api.get("/pre-reports/pending");
  }
  approvePreReport(id) {
    return api.patch(`/pre-reports/${id}/approve`);
  }
  rejectPreReport(id, reason) {
    return api.patch(`/pre-reports/${id}/reject`, { reason });
  }

  // ================= Post-Reports =================
  createPostReport(data) {
    return api.post("/post-reports", data);
  }
  getPendingPostReports() {
    return api.get("/post-reports/pending");
  }
  approvePostReport(id) {
    return api.patch(`/post-reports/${id}/approve`);
  }
  rejectPostReport(id, reason) {
    return api.patch(`/post-reports/${id}/reject`, { reason });
  }
  getPostReport(id) {
    return api.get(`/post-reports/${id}`);
  }
}

export default new ReportService();