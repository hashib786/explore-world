import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import IUser from "../interfaces/userInterface";
import crypto from "node:crypto";

// Create a Mongoose schema for the user
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      // You can add additional validation for email format if needed
    },
    photo: {
      type: String,
      // You can add validation for photo URL format if needed
    },
    password: {
      type: String,
      select: false,
      required: [true, "Please provide a password"],
      minLength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "guide", "lead-guide"],
      default: "user",
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (this: IUser, value: string): boolean {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hashing Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 14);
  this.confirmPassword = undefined;

  next();
});
// when password update so update passwordchangeAt field
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  this.confirmPassword = undefined;

  next();
});

// here this points to current document
userSchema.methods.isCorrectPassword = async function (
  candidatePassword: string,
  hashUserPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(candidatePassword, hashUserPassword);
};

userSchema.methods.isPasswordChanged = function (JWTTimestamp: number) {
  if (this.passwordChangeAt) {
    const changeTimeStamp =
      parseInt(this.passwordChangeAt.getTime(), 10) / 1000;

    return JWTTimestamp < changeTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function (): String {
  // this is simple reset token for sending email
  const resetToken = crypto.randomBytes(32).toString("hex");

  // This is encrypted reset token which one is stored in the database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Create and export the User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
