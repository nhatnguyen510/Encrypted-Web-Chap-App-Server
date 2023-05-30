import mongoose from "mongoose";

const UserOTPVerificationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
  },
});

UserOTPVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const UserOTPVerificationModel = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);

export default UserOTPVerificationModel;
