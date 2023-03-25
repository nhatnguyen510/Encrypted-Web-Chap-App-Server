import jwt from "jsonwebtoken";
import { SECRET } from "../config/index.js";

export const Auth = (req, res, next) => {
  const token = req.headers?.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authorization Failed!",
    });
  }

  jwt.verify(token, SECRET.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      console.log({ decodedToken, err });
      return res.status(403).json({
        message: "Token is expired!",
      });
    }
    req.user = decodedToken;

    next();
  });
};
