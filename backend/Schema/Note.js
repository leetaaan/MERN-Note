import mongoose, { Schema } from "mongoose";

const noteSchema = mongoose.Schema(
  {
    note_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    activity: {
      isPinned: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

export default mongoose.model("notes", noteSchema);