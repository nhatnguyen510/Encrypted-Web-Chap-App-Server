import jwt from "jsonwebtoken";

export const Auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Authentication Failed!",
    });
  }
};
