import mongoose from "mongoose";

type connectionObject = {
  isConnected?: Number;
};

const connection: connectionObject = {};

export const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already Connected!");
    return;
  }
  await import('@/app/models/chat.model');
  await import('@/app/models/user.model');
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected!");
  } catch (error) {
    console.log("db connection failed!", error);
    process.exit(1)
  }
};
