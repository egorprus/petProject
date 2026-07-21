import mongoose from "mongoose";

const CalendarEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["birthday", "meeting", "task", "reminder", "holiday", "other"],
      default: "other",
    },
    isRecurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);
CalendarEventSchema.index({ user: 1, startDate: 1 })

export default mongoose.model("CalendarEvent", CalendarEventSchema);
