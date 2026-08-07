import { json } from "zod";
import prisma from "../utils/prisma.js";

export const createComment = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const { postId, content } = req.body;

    if (!postId || !content) {
      res.status(400).json({
        message: "inputan post dan konten wajib di isi",
      });
    }

    const postData = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "Post/feed tidak di temukan",
      });
    }

    //insert Data
    const newComment = await prisma.comment.create({
      data: {
        userId: Number(currentUserId),
        postId: Number(postId),
        content,
      },
    });

    // Update Post Count
    await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        commentCount: { increment: 1 },
      },
    });

    res.status(201).json({
      message: "Comment Berhasil",
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

export const DeleteCommentById = async (req, res) => {
  console.log("MASUK DELETE COMMENT");
  const { id } = req.params;

  const currentUserId = req.user.id;

  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!comment) {
    return res.status(404).json({
      message: "Comment Not Found",
    });
  }

  if (comment.userId != currentUserId) {
    return res.status(400).json({
      message: "Anda tidak bisa menghapus komentar user lain",
    });
  }

  await prisma.comment.delete({
    where: {
      id: Number(id),
    },
  });

  await prisma.post.update({
    where: {
      id: Number(comment.postId),
    },
    data: {
      commentCount: { decrement: 1 },
    },
  });

  res.status(200).json({
    message: "Delete Comment Berhasil",
  });
};
