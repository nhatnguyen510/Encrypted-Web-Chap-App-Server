import mongoose from "mongoose";
import { config } from "./index.js";

const URI = `mongodb+srv://${config.DATABASE.DB_USERNAME}:${config.DATABASE.DB_PASSWORD}@encrypted-chat-app.wlowcxk.mongodb.net/?retryWrites=true&w=majority`;

const connectDatabase = async () => {
  return await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDatabase;
