import api from "./api";

const userService = {
  getTeamLeaders() {
    return api.get("/users/team-leaders");
  },
  getMyTeam() {
    return api.get("/users/my-team");
  },
  // ==== ADD THIS NEW METHOD ====
  createUser(data) {
    return api.post("/users", data);
  }

  
};

export default userService;