import mongoose from "mongoose";
import { DB } from "../config/index.js";

const URI = `mongodb+srv://${DB.DB_USERNAME}:${DB.DB_PASSWORD}@encrypted-chat-app.wlowcxk.mongodb.net/?retryWrites=true&w=majority`;

const connectDatabase = async () => {
  return await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDatabase;
