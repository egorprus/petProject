import crypto from "crypto";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const getAll = async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.userId }).sort({ title: 1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Не удалось загрузить фильмы" });
  }
};

export const create = async (req, res) => {
  try {
    const { title, genre, rating, notWatched, isSeries, favorite } = req.body;
    const doc = new Movie({ user: req.userId, title, genre, rating, notWatched, isSeries, favorite });
    const movie = await doc.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: "Не удалось добавить фильм" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findOneAndUpdate({ _id: id, user: req.userId }, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Не удалось обновить фильм" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Не удалось удалить фильм" });
  }
};

export const getShareLink = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (!user.movieShareToken) {
      user.movieShareToken = crypto.randomUUID();
      await user.save();
    }

    res.json({ shareToken: user.movieShareToken });
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить ссылку" });
  }
};

export const regenerateShareLink = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { movieShareToken: crypto.randomUUID() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ shareToken: user.movieShareToken });
  } catch (err) {
    res.status(500).json({ message: "Не удалось обновить ссылку" });
  }
};

export const getShared = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ movieShareToken: token });

    if (!user) {
      return res.status(404).json({ message: "Ссылка недействительна" });
    }

    const movies = await Movie.find({ user: user._id }).sort({ title: 1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Не удалось загрузить фильмы" });
  }
};
