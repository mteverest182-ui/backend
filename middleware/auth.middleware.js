import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const AuthMiddleware = async (req, res, next) => {
  const JWTSECRET = process.env.JWTSECRET;

  try {
    const headers = req.headers.authorization;

    if (!headers) {
      return res.status(401).json({
        message: "Authorization Error, Token belum di Input",
      });
    }

    const token = headers.split("Bearer ")[1];
    const decoded = jwt.verify(token, JWTSECRET);

    const currentUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    req.user = {
      id: currentUser.id,
      fullname: currentUser.fullname,
      username: currentUser.username,
      email: currentUser.email,
      image: currentUser.image,
      bio: currentUser.bio,
    };

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
