import mongoose from "mongoose";

const magazineSchema = new mongoose.Schema(
  {
    name: String,
    link: String,
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Magazine ||
  mongoose.model("Magazine", magazineSchema);
