import userService from "./user.service.js";

class UserController {
  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json({
        success: true,
        message: "User created successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTeamLeaders(req, res, next) {
    try {
      const teamLeaders = await userService.getTeamLeaders();
      return res.status(200).json({
        success: true,
        data: teamLeaders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {};
      if (req.query.role) {
        filters.role = req.query.role;
      }
      const users = await userService.getAll(filters);
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  // NEW METHOD
  async getMyTeam(req, res, next) {
    try {
      const team = await userService.getMyTeam(req.user._id);
      return res.status(200).json({
        success: true,
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();