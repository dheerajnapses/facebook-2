const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const response = require("../utils/responseHandler");
const { generateToken } = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, gender, dateOfBirth } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    console.log('Existing user:', existingUser);

    if (existingUser) {
      return response(res, 400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
      isAuthenticated: true
    });

    await newUser.save();

    const accessToken = generateToken(newUser);

    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
      

    // Respond with success message and user data (excluding password)
    return response(res, 201, "User registered successfully", {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      gender: newUser.gender,
      dateOfBirth: newUser.dateOfBirth,
      isAuthenticated: newUser.isAuthenticated
    });
  } catch (error) {
    return response(res, 500, "Internal Server error", error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response(res, 400, "Invalid credentials");
    }

    // Create JWT token
    const accessToken = generateToken(user);

    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    
    

    // Respond with success message and user data
    return response(res, 200, "User logged in successfully", {
      username: user.username,
      email: user.email,
      isAuthenticated: user.isAuthenticated
    });
  } catch (error) {
    return response(res, 500, "Internal Server error", error.message);
  }
};

const logout = (req, res) => {
  try {
    res.cookie("auth_token", "", { expires: new Date(0) });
    return response(res, 200, "Successfully logged out");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server error");
  }
};

module.exports = { registerUser, loginUser, logout };
