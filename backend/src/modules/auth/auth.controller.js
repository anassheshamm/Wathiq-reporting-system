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

  async forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body.email);

    return res.status(200).json({
      success: true,
      message:
        "If the email exists, a password reset link has been sent.",
    });
  } catch (error) {
  console.error("❌ FORGOT PASSWORD ERROR:", error);
  next(error);
}
}

async resetPassword(req, res, next) {
  try {
    await authService.resetPassword(
      req.body.token,
      req.body.password
    );

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
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
