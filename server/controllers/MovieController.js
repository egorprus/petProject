import Movie from "../models/Movie.js";

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
