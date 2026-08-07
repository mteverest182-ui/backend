import prisma from "../utils/prisma.js";

export const LikeFeedUser = async (req, res) => {
  // requestr
  const currentUserId = req.user.id;
  const { postId } = req.params;

  try {
    //validation
    const postData = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "Post/Feed tidak ditemukan",
      });
    }

    // Check jika user sudah melakukan like post tersebut
    const CheckLike = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: Number(postId),
        },
      },
    });

    if (CheckLike) {
      return res.status(400).json({
        message: "Post Sudah Pernah Anda like",
      });
    }

    // Insert Data Like
    const newLike = await prisma.likes.create({
      data: {
        userId: currentUserId,
        postId: Number(postId),
      },
    });

    //update post
    await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        likeCount: { increment: 1 },
      },
    });

    res.status(201).json({
      message: "Berhasil Like feed",
      data: newLike,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
      error,
    });
  }
};

export const CheckLikeUser = async (req, res) => {
  const { postId } = req.params;
  const currentUserId = req.user.id;

  try {
    //validator

    const postData = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "Post/Feed tidak di temukan",
      });
    }

    const checkLike = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: Number(postId),
        },
      },
    });

    if (checkLike) {
      return res.status(200).json({
        data: true,
      });
    }

    return res.status(200).json({
      data: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Down",
      error,
    });
  }
};
