import "dotenv/config";
import express from "express";
import AuthRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import followRouter from "./routes/follow.route.js";
import FeedRouter from "./routes/feed.route.js";
import commentRouter from "./routes/comment.route.js";
import LikeRouter from "./routes/likes.route.js";
import BookmarkRouter from "./routes/bookmark.route.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors);
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", userRouter);
app.use("/api/follow", followRouter);
app.use("/api/feed", FeedRouter);
app.use("/api/comment", commentRouter);
app.use("/api/like", LikeRouter);
app.use("/api/bookmark", BookmarkRouter);

app.listen(port, () => {
  console.log(`server sedang berjalan di port ${port}`);
});
