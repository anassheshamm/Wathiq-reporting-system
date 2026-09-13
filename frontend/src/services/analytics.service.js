import api from "./api";

const analyticsService = {
  getDashboardSummary(from, to) {
    return api.get("/analytics/dashboard", { params: { from, to } });
  }
};

export default analyticsService;