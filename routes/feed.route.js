import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  CreateFeed,
  detailFeed,
  ReadAllFeeds,
  deleteFeed,
} from "../controllers/feed.controller.js";

const FeedRouter = express.Router();

FeedRouter.post("/", AuthMiddleware, upload.single("image"), CreateFeed);
FeedRouter.get("/", AuthMiddleware, ReadAllFeeds);
FeedRouter.get("/:id", AuthMiddleware, detailFeed);
FeedRouter.delete("/:id", AuthMiddleware, deleteFeed);

export default FeedRouter;
