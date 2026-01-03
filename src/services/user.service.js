import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { signToken } from "../config/jwt.js";

export const registerUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User already exists");

  data.password = await hashPassword(data.password);
  const user = await User.create(data);

  return {
    token: signToken({ id: user._id, role: user.role }),
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await comparePassword(password, user.password)))
    throw new Error("Invalid credentials");

  return {
    token: signToken({ id: user._id, role: user.role }),
  };
};

export const getProfile = async (id) => {
  return User.findById(id).select("-password");
};
