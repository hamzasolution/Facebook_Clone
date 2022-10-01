const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");
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
    const emailverificationToken = generateToken(
      {
        id: user._id.toString(),
      },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailverificationToken}`;
    console.log(url);
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Register Success ! please activate your mail to start",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById({ _id: user.id });
    if (check.verified) {
      return res.status(400).json({
        message: "Account already activated!",
      });
    } else {
      await User.findByIdAndUpdate({ _id: user.id }, { verified: true });
      return res.status(200).json({
        message: "Account has been activated successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "The entered email does not exist to any account.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password.Please try again.",
      });
    }
    // if (!user.verified) {
    //   return res.status(400).json({
    //     message: "Please activate your account first",
    //   });
    // }
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message:
        "Login successful! Welcome back " +
        user.first_name +
        " " +
        user.last_name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
