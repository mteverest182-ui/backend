import prisma from "../utils/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import { treeifyError } from "zod/v4/core";

export const CreateFeed = async (req, res) => {
  try {
    const { caption } = req.body;
    const currentUserId = req.user.id;

    //Validation
    if (!caption) {
      return res.status(400).json({ message: "caption wajib di isi" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File Gambar belum di input" });
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "feeds",
      transformation: [
        { aspect_ratio: "4:5", crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    //Buat Postingan feed baru
    const newFeed = await prisma.post.create({
      data: {
        caption,
        image: result.secure_url,
        imageId: result.public_id,
        userId: currentUserId,
      },
    });

    //Update data User

    await prisma.user.update({
      where: {
        id: Number(currentUserId),
      },
      data: {
        postCount: { increment: 1 },
      },
    });

    //response
    res.status(201).json({
      message: "Feed berhasil dibuat",
      data: newFeed,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Down",
      error: message.error,
    });
  }
};

export const ReadAllFeeds = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const followings = await prisma.follow.findMany({
      where: { followingId: currentUserId },
      select: { followerId: true },
    });

    const followingIdS = followings.map((f) => f.followerId);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const totalFeed = await prisma.post.count({
      where: {
        userId: { in: [...followingIdS, currentUserId] },
      },
    });

    const post = await prisma.post.findMany({
      where: {
        userId: { in: [...followingIdS, currentUserId] },
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createAt: "desc",
      },
      skip: skip,
      take: limit,
    });

    const totalPage = Math.ceil(totalFeed / limit);

    res.status(200).json({
      page,
      limit,
      totalPage,
      totalFeed,
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Down",
      error: message.error,
    });
  }
};

export const detailFeed = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            image: true,
          },
        },

        comments: {
          select: {
            content: true,
            createAt: true,
            user: {
              select: {
                id: true,
                fullname: true,
                username: true,
                image: true,
                createAt: true,
              },
            },
          },

          orderBy: { createAt: "desc" },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Get Detail Feed",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Down",
      error: message.error,
    });
  }
};

export const deleteFeed = async (req, res) => {
  const { id } = req.params;

  try {
    const postData = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "Feeds Tidak ditemukan",
      });
    }

    if (postData.userId != req.user.id) {
      return res.status(400).json({
        message: "anda tidak bisa menghapus feed user lain",
      });
    }

    if (postData.imageId) {
      await cloudinary.uploader.destroy(postData.imageId);
    }

    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        postCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({
      message: "Data Feed Berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
      error,
    });
  }
};
