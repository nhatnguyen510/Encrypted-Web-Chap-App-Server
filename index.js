import express from "express";
import { createServer } from "http";
import { readFileSync } from "fs";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";
import cors from "cors";
import router from "./src/routes/index.js";
import morgan from "morgan";
import connectDatabase from "./src/models/database.js";
import cookieParser from "cookie-parser";
import socket from "./src/lib/socket.js";
import { createDiffieHellman, getDiffieHellman } from "diffie-hellman";

const app = express();
const server = createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1", router);
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  })
);

app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  console.log("Connecting to Database successfully!");
  server.listen(PORT, () => {
    socket(server);
    console.log(`Listening on PORT ${PORT}`);
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
