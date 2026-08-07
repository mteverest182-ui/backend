import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import {
  CheckSavedFeed,
  toogleSavedFeed,
} from "../controllers/bookmark.controller.js";

const BookmarkRouter = express.Router();

BookmarkRouter.post("/:postid", AuthMiddleware, toogleSavedFeed);
BookmarkRouter.get("/:postid", AuthMiddleware, CheckSavedFeed);

export default BookmarkRouter;
