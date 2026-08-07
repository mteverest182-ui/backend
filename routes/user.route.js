import express from "express";
import {
  getSearchUser,
  getUserbyUsername,
  updateAvatar,
  updateUser,
} from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const userRouter = express.Router();

userRouter.get("/search", getSearchUser);
userRouter.get("/:username", getUserbyUsername);
userRouter.put("/update-user", AuthMiddleware, updateUser);
userRouter.put(
  "/update-photo-profile",
  AuthMiddleware,
  upload.single("image"),
  updateAvatar,
);

export default userRouter;
