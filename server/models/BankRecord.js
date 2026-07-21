import mongoose from "mongoose";

const BankRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    expected: { type: String, required: true },
    received: { type: String, required: true },
    rate: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("BankRecord", BankRecordSchema);
