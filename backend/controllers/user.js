const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const { generateToken } = require("../helpers/tokens");
const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Email already exists, Try with a different email address",
      });
    }

    if (!validateLength(first_name, 6, 30)) {
      return res.status(400).json({
        message: "First name must be between 6 and 30 characters",
      });
    }

    if (!validateLength(last_name, 6, 30)) {
      return res.status(400).json({
        message: "Last name must be between 6 and 30 characters",
      });
    }

    if (!validateLength(password, 8, 30)) {
      return res.status(400).json({
        message: "Password must be atleast 8 characters",
      });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    let tempUsername = first_name + last_name;
    // let newUsername = await validateUsername(tempUsername);

    const user = await new User({
      first_name,
      last_name,
      email,
      username: tempUsername,
      password: cryptedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();
    const emailverification = generateToken({ id: user._id.toString() }, "30m");
    console.log(emailverification);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
