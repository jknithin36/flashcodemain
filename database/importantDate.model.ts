import mongoose from "mongoose";

const importantDateSchema = new mongoose.Schema(
  {
    event: String,
    date: Date,
    semester: {
      type: String,
      enum: ["Spring2025", "Summer2025", "Fall2025"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.ImportantDate ||
  mongoose.model("ImportantDate", importantDateSchema);
