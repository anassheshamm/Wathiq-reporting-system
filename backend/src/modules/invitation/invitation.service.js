// backend/src/modules/invitation/invitation.service.js
import crypto from "crypto";
import Invitation from "./invitation.model.js";
import User from "../user/user.model.js";
import AppError from "../../shared/errors/AppError.js";
import sendEmail from "../../shared/utils/sendEmail.js";

class InvitationService {
  async create(data, createdBy) {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError("هذا المستخدم مسجل بالفعل.", 409);
    }

    // 2. Check pending invitation
    const existingInvitation = await Invitation.findOne({
      email: data.email,
      status: "pending",
    });
    if (existingInvitation) {
      throw new AppError("يوجد دعوة قيد الانتظار لهذا البريد الإلكتروني.", 409);
    }

    // 3. Generate Token & Expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

    // 4. Save to Database
    const invitation = await Invitation.create({
      email: data.email,
      role: data.role,
      token,
      expiresAt,
      createdBy,
    });

    // 5. Construct Email Data
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const registrationLink = `${frontendUrl}/register?token=${token}`;
    
    // Arabic roles mapping for the email template
    const roleNames = {
      admin: "مسؤول نظام (مدير)",
      teamLeader: "رئيس فريق",
      doctor: "مرشد تعافي / معالج"
    };

    const message = `
      <div dir="rtl" style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1E7A5A; text-align: center;">دعوة للانضمام للنظام</h2>
        <p>مرحباً،</p>
        <p>لقد تمت دعوتك للانضمام إلى <strong>نظام إدارة التعافي</strong> بصلاحية: <strong>${roleNames[data.role] || data.role}</strong>.</p>
        <p>الرجاء النقر على الزر أدناه لإنشاء حسابك وإكمال البيانات:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${registrationLink}" style="background-color: #35C759; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">إنشاء الحساب الآن</a>
        </div>
        <p style="font-size: 13px; color: #6b7280;">هذا الرابط صالح لمدة 7 أيام. إذا لم تكن تتوقع هذه الدعوة، يمكنك تجاهل هذا البريد.</p>
      </div>
    `;

    // 6. Send the Email
    try {
      await sendEmail({
        email: data.email,
        subject: "دعوة إنشاء حساب - نظام إدارة التعافي",
        html: message,
      });
    } catch (error) {
      console.error("SMTP Error:", error);
      // Optional: Delete invitation if email fails entirely
      // await Invitation.findByIdAndDelete(invitation._id);
      throw new AppError("تم إنشاء الدعوة، لكن فشل إرسال البريد الإلكتروني. يرجى التحقق من إعدادات SMTP.", 500);
    }

    return invitation;
  }

  async verify(token) {
  const invitation = await Invitation.findOne({
    token,
    status: "pending",
  });

  if (!invitation) {
    throw new AppError("Invalid invitation token.", 400);
  }

  if (invitation.expiresAt < new Date()) {
    throw new AppError("Invitation has expired.", 400);
  }

  return {
    email: invitation.email,
    role: invitation.role,
  };
}

}

export default new InvitationService();