import express from "express";
import {
  followUserAccount,
  getLimitUser,
  unfollowUserAccount,
} from "../controllers/follow.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const followRouter = express.Router();

followRouter.post("/", AuthMiddleware, followUserAccount);
followRouter.delete("/:unfollowUserId", AuthMiddleware, unfollowUserAccount);
followRouter.get("/user", AuthMiddleware, getLimitUser);

export default followRouter;
