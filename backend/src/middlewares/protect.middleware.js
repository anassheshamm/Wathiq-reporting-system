import jwt from "jsonwebtoken";

import AppError from "../shared/errors/AppError.js";
import userService from "../modules/user/user.service.js";

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Authentication required.", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.findById(decoded.sub);
console.log("Decoded:", decoded);
        if (!user) {
            return next(new AppError("Not authorized, user not found.", 401));
        }

        req.user = user; // Attach the user object to the request
        next();
    } catch (error) {
  console.error("JWT ERROR:", error);

  return next(new AppError("Invalid or expired token.", 401));
}   
};

export default protect;