import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const videoSchema = new Schema({
  video: {
    id: String,
    publishDate: String,
    title: String,
    channelTitle: String,
    description: String,
    duration: Number,
  },
  chapters: [
    {
      id: Number,
      time: Number,
      title: String,
      duration: Number,
      viewed: Boolean,
    },
  ],
});

export const Video =
  mongoose?.models?.Video || mongoose.model("Video", videoSchema);
