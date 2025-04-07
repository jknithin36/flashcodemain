// /database/event.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  link: string;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    time: { type: String },
    location: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
