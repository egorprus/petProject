import mongoose from "mongoose";
import UserModel from "../models/User.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      login: req.body.login,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatar,
      passwordHash: hash,
      isAdmin: false,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      login: req.body.login,
    }).select("+passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    if (userId === req.userId) {
      const { passwordHash, ...userData } = user._doc;
      return res.json(userData);
    }

    const { _id, fullName, login, avatarUrl } = user._doc;
    res.json({ _id, fullName, login, avatarUrl });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const set = {};
    const unset = {};
    if (req.body.fullName !== undefined) {
      set.fullName = req.body.fullName;
    }
    if (req.body.email !== undefined) {
      if (req.body.email) {
        set.email = req.body.email;
      } else {
        unset.email = "";
      }
    }

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $set: set, $unset: unset },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Почта уже используется",
      });
    }
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить профиль",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("+passwordHash");
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.currentPassword,
      user.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный текущий пароль",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(req.body.newPassword, salt);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось сменить пароль",
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        avatarData: req.file.buffer,
        avatarContentType: req.file.mimetype,
        // ?v= changes on every upload so browsers drop the cached old image
        avatarUrl: `/user/${req.userId}/avatar?v=${Date.now()}`,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось загрузить аватар",
    });
  }
};

// Public on purpose: <img> tags can't send the Authorization header.
export const getAvatar = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.sendStatus(404);
    }

    const user = await UserModel.findById(req.params.id).select(
      "+avatarData +avatarContentType"
    );
    if (!user?.avatarData) {
      return res.sendStatus(404);
    }

    res.set({
      "Content-Type": user.avatarContentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    res.send(user.avatarData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
