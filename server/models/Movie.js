import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    genre: {
      type: String,
      enum: [
        "action",
        "comedy",
        "drama",
        "horror",
        "sciFi",
        "fantasy",
        "thriller",
        "romance",
        "documentary",
        "animation",
        "other",
      ],
      default: "other",
    },
    rating: { type: String },
    notWatched: { type: Boolean, default: false },
    isSeries: { type: Boolean, default: false },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", MovieSchema);
