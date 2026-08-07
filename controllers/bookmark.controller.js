import prisma from "../utils/prisma.js";

export const toogleSavedFeed = async (req, res) => {
  const { postid } = req.params;
  const currentUserId = req.user.id;

  try {
    //validation
    const postData = await prisma.post.findUnique({
      where: {
        id: Number(postid),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "Post atau Feed Tidak ditemukan",
      });
    }

    const checkUserBookMark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: Number(postid),
        },
      },
    });

    if (checkUserBookMark) {
      // Delet Bookmark
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: Number(postid),
          },
        },
      });
      return res.status(200).json({
        message: "Berhasil unsave Post/Feed",
      });
    }

    //Create Bookmark
    const newBookmark = await prisma.bookmark.create({
      data: {
        userId: req.user.id,
        postId: Number(postid),
      },
    });

    return res.status(200).json({
      message: "Berhasil Save Post/Feed",
      data: newBookmark,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Down",
      error,
    });
  }
};

export const CheckSavedFeed = async (req, res) => {
  try {
    const { postid } = req.params;
    const currentUserId = req.user.id;

    const checkSaved = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: Number(postid),
        },
      },
    });

    if (checkSaved) {
      return res.status(200).json({ data: true });
    }

    return res.status(200).json({ data: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " Server Down ",
      error,
    });
  }
};
