import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  videos: [
    {
      video: {
        id: String,
        publishDate: String,
        title: String,
        channelTitle: String,
        description: String,
        duration: Number,
        completedPercent: Number,
        lastWatchTime: Number,
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
      notes: [
        {
          time: Number,
          timeString: String,
          chapterId: Number,
          chapterTitle: String,
          content: String,
        },
      ],
    },
  ],
});

export const User =
  mongoose?.models?.User || mongoose.model("User", userSchema);
