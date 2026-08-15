import User from "./user.model.js";
import bcrypt from "bcryptjs";
import AppError from "../../shared/errors/AppError.js";

class UserService {
  async create(data) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError("Email already exists.", 400);
    }
         
    const existingNationalId = await User.findOne({ nationalId: data.nationalId });
    if (existingNationalId) {
      throw new AppError("National ID already exists.", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    
    const user = await User.create(data);
    const userObject = user.toObject();
    delete userObject.password; 
         
    return userObject;
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  async findByNationalId(nationalId) {}

  async findById(id) {
    return await User.findById(id);
  }

  async getProfile(userId) {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
}

  async getTeamLeaders() {
    return await User.find({
      role: "teamLeader",
      isActive: true,
    })
      .select("firstName middleName lastName email")
      .sort({ firstName: 1 });
  }

  async getAll(filters = {}) {
    return await User.find(filters)
      .select("-password")
      .sort({ createdAt: -1 });
  }

  // NEW METHOD: Get doctors assigned to a specific team leader
  async getMyTeam(teamLeaderId) {
    return await User.find({
      role: "doctor",
      teamLeader: teamLeaderId,
      isActive: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });
  }

  async deactivate(id) {}
}

export default new UserService();