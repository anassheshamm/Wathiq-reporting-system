import authService from "./auth.service.js";

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
}

export default new AuthController();
