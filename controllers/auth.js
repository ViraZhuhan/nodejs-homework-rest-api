const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
// const { nanoid } = require("nanoid");

const { User } = require("../models/users");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({  ...req.body, avatarURL,
    password: hashPassword,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "23h",
  });

  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    user,
    token
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscriptionUser = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });

  res.json({ _id, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw HttpError(401);
  }
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({message: "Logout success"});
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw HttpError(401);
  }
  const { path: tempUpload, originalname } = req.file;
  jimp
    .read(tempUpload)
    .then((avatar) => {
      return avatar.cover(250, 250).write(resultUpload);
    })
    .catch((error) => {
      console.error(error);
    });
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};


module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  logout: ctrlWrapper(logout)
};
