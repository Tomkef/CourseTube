import mongoose from "mongoose";

async function dbConnect() {
  try {
    const isConnectionReady = mongoose.connections[0].readyState;
    if (!isConnectionReady) {
      await mongoose.connect(process.env.MONGODB_URI);
      return true;
    }
    return true;
  } catch (error) {
    console.log("Error trying to connect to database: ", { error });
    return false;
  }
}

export default dbConnect;
