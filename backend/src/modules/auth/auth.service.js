import bcrypt from "bcryptjs";
import crypto from "crypto";

import userService from "../user/user.service.js";
import AppError from "../../shared/errors/AppError.js";

import generateToken from "../../shared/utils/generateToken.js";
import Invitation from "../invitation/invitation.model.js";
import PasswordReset from "./passwordReset.model.js";

import sendEmail from "../../shared/utils/sendEmail.js";

class AuthService {
  async login(email, password) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new AppError(
  "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات والمحاولة مرة أخرى.",
  401
);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
  "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات والمحاولة مرة أخرى.",
  401
);
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    const userObject = user.toObject();
    delete userObject.password; // Remove password from the returned object

return {
  token,
  user: userObject,
};

  }

async forgotPassword(email) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userService.findByEmail(normalizedEmail);

  if (!user) {
    return;
  }

  await PasswordReset.deleteMany({
    user: user._id,
  });

  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() + 30 * 60 * 1000
  );

  await PasswordReset.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  const frontendUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const resetLink =
    `${frontendUrl}/reset-password?token=${rawToken}`;

  const message = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8;">
      <h2>إعادة تعيين كلمة المرور</h2>

      <p>
        تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك
        في نظام إدارة التعافي.
      </p>

      <p>
        اضغط على الزر التالي لإنشاء كلمة مرور جديدة:
      </p>

      <p>
        <a
          href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 24px;
            background-color:#34C759;
            color:white;
            text-decoration:none;
            border-radius:8px;
          "
        >
          إعادة تعيين كلمة المرور
        </a>
      </p>

      <p>
        هذا الرابط صالح لمدة 30 دقيقة فقط.
      </p>

      <p>
        إذا لم تطلب إعادة تعيين كلمة المرور،
        يمكنك تجاهل هذه الرسالة.
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "إعادة تعيين كلمة المرور - نظام إدارة التعافي",
    html: message,
  });
}

async resetPassword(token, newPassword) {
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const resetRequest = await PasswordReset.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRequest) {
    throw new AppError(
      "Invalid or expired password reset link.",
      400
    );
  }

  const user = await userService.findById(
    resetRequest.user
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  user.password = hashedPassword;

  await user.save();

  await PasswordReset.deleteOne({
    _id: resetRequest._id,
  });
}


  async register(data) {
    const invitation = await Invitation.findOne({
  token: data.token,
  status: "pending",
});
    if (!invitation) {
  throw new AppError("Invalid invitation token.", 400);
}

    if (invitation.expiresAt < new Date()) {
  throw new AppError("Invitation has expired.", 400);
}

const userData = {
  firstName: data.firstName,
  middleName: data.middleName,
  lastName: data.lastName,

  nationalId: data.nationalId,
  phone: data.phone,
  jobTitle: data.jobTitle,
  gender: data.gender,

  password: data.password,

  email: invitation.email,
  role: invitation.role,
};

const user = await userService.create(userData);

invitation.status = "accepted";
invitation.acceptedAt = new Date();

await invitation.save();

return user;

}

  
}

export default new AuthService();
