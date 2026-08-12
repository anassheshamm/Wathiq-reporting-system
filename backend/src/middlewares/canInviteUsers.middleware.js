import AppError from "../shared/errors/AppError.js";

const canInviteUsers = (req, res, next) => {
  if (!req.user.canInviteUsers) {
    return next(
      new AppError("You are not allowed to invite users.", 403)
    );
  }

  next();
};

export default canInviteUsers;