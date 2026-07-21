import BankRecord from "../models/BankRecord.js";

export const getAll = async (req, res) => {
  try {
    const records = await BankRecord.find({ user: req.userId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Не удалось загрузить записи" });
  }
};

export const create = async (req, res) => {
  try {
    const { date, expected, received, rate } = req.body;
    const doc = new BankRecord({ user: req.userId, date, expected, received, rate });
    const record = await doc.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Не удалось создать запись" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    await BankRecord.findOneAndUpdate({ _id: id, user: req.userId }, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Не удалось обновить запись" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await BankRecord.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Не удалось удалить запись" });
  }
};
