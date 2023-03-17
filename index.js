import { createDiffieHellman, getDiffieHellman } from "diffie-hellman";
import express from "express";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/index.js";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api/v1", router);
app.use(morgan("dev"));

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@encrypted-chat-app.wlowcxk.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connecting to Database successfully!");
  });

// Generate the Diffie-Hellman key pair
const dh = createDiffieHellman(128);

app.post("/generateKey", (req, res) => {
  const user = createDiffieHellman(dh.getPrime(), dh.getGenerator());
  const publicKey = user.generateKeys();

  // Send the public key to the client
  res.json({
    user,
    publicKey: publicKey,
    HexPublicKey: publicKey.toString("hex"),
  });
});

// app.post("/encryptMessage", (req, res) => {
//   // Receive the shared secret and message from the client
//   let publicKey = req.body.publicKey;
//   const message = req.body.message;

//   if (!Buffer.isBuffer(publicKey)) {
//     console.log("Change to buffer");
//     publicKey = Buffer.from(publicKey, "hex");
//   }
//   console.log(publicKey);

//   const sharedSecret = dh.computeSecret(publicKey);

//   // Encrypt the message using the shared secret and CryptoJS
//   const encryptedMessage = CryptoJS.AES.encrypt(
//     message,
//     sharedSecret.toString("hex")
//   ).toString();

//   // Send the encrypted message to the client
//   res.json({ publicKey });
// });

// app.post("/decryptMessage", (req, res) => {
//   // Receive the encrypted message from the client
//   const encryptedMessage = req.body.encryptedMessage;

//   const sharedSecret = dh.computeSecret(Buffer.from(req.body.publicKey, "hex"));

//   // Decrypt the message using the shared secret and CryptoJS
//   const decryptedMessage = CryptoJS.AES.decrypt(
//     encryptedMessage,
//     sharedSecret.toString("hex")
//   ).toString(CryptoJS.enc.Utf8);

//   // Send the decrypted message to the client
//   res.json({ decryptedMessage });
// });

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});