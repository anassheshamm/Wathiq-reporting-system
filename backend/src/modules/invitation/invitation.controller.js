import invitationService from "./invitation.service.js";

class InvitationController {
  async create(req, res, next) {
    try {
      const invitation = await invitationService.create(
        req.body,
        req.user._id
      );

      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:5173";

      return res.status(201).json({
        success: true,
        message: "Invitation created successfully.",
        data: {
          invitation,
          registrationLink:
            `${frontendUrl}/register?token=${invitation.token}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async verify(req, res, next) {
  try {
    const invitation = await invitationService.verify(
      req.params.token
    );

    return res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
}
}

export default new InvitationController();