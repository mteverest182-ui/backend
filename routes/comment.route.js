import expresss from "express";
import {
  createComment,
  DeleteCommentById,
} from "../controllers/comment.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const commentRouter = expresss.Router();

commentRouter.post("/", AuthMiddleware, createComment);
commentRouter.delete("/:id", AuthMiddleware, DeleteCommentById);

export default commentRouter;
