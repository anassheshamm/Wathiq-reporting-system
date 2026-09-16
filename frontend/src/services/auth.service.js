import api from "./api";

const authService = {
  login(data) {
    return api.post("/auth/login", data);
  },

  register(data) {
    return api.post("/auth/register", data);
  },

  forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword(token, password) {
    return api.post("/auth/reset-password", {
      token,
      password,
    });
  },
};

export default authService;