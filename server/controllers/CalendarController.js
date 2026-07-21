import CalendarEvent from "../models/CalendarEvent.js";

const shiftToYear = (date, year) => {
  const shifted = new Date(date);
  shifted.setFullYear(year);
  return shifted;
};

export const getAll = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    const events = await CalendarEvent.find({
      user: req.userId,
      $or: [
        { isRecurring: true },
        { startDate: { $lte: yearEnd }, endDate: { $gte: yearStart } },
      ],
    }).sort({ startDate: 1 });

    const result = events.map((event) => {
      if (!event.isRecurring) return event;
      const durationMs = event.endDate.getTime() - event.startDate.getTime();
      const startDate = shiftToYear(event.startDate, year);
      const endDate = new Date(startDate.getTime() + durationMs);
      return { ...event.toObject(), startDate, endDate };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Не удалось загрузить события" });
  }
};

export const create = async (req, res) => {
  try {
    const { startDate, endDate, description, type, isRecurring } = req.body;
    const doc = new CalendarEvent({
      user: req.userId,
      startDate,
      endDate,
      description,
      type,
      isRecurring,
    });
    const event = await doc.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Не удалось создать событие" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    await CalendarEvent.findOneAndUpdate({ _id: id, user: req.userId }, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Не удалось обновить событие" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await CalendarEvent.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Не удалось удалить событие" });
  }
};
