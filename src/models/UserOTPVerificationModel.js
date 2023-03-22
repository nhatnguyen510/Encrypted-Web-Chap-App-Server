import mongoose from "mongoose";

const UserOTPVerificationSchema = mongoose.Schema({
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
  expiredAt: {
    type: Date,
  },
});

const UserModel = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);
export default UserModel;
