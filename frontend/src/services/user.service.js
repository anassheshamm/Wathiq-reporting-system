import api from "./api";

const userService = {
  getTeamLeaders() {
    return api.get("/users/team-leaders");
  },
  getMyTeam() {
    return api.get("/users/my-team");
  },
  createUser(data) {
    return api.post("/users", data);
  },
  // ==== ADDED PROFILE METHODS ====
  getProfile() {
    return api.get("/users/profile");
  },
  updateProfile(data) {
    return api.put("/users/profile", data);
  }
};

export default userService;