import prisma from "../utils/prisma.js";

export const followUserAccount = async (req, res) => {
  // inputan current user inputan follow user

  const currentUser = req.user.id;

  const { followUserId } = req.body;

  // check jika current user sama dengan followuserid
  if (currentUser === followUserId) {
    return res.status(400).json({
      message: "Tidak bisa follow akun sendiri",
    });
  }

  const otherUserId = await prisma.user.findUnique({
    where: {
      id: Number(followUserId),
    },
  });

  if (!otherUserId) {
    return res.status(404).json({
      message: "User Id Tidak Ditemukan",
    });
  }

  const isFollowUser = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: Number(currentUser),
        followingId: Number(followUserId),
      },
    },
  });

  if (isFollowUser) {
    return res.status(400).json({
      message: "user sudah pernah di follow",
    });
  }
  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: followUserId,
        followingId: currentUser,
      },
    });

    // update user Count

    await prisma.user.update({
      where: {
        id: followUserId,
      },
      data: {
        followingCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "Follow User Berhasil",
      data: follow,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messsage: "Tidak berhasil Follow",
      data: follow,
    });
  }
};

export const unfollowUserAccount = async (req, res) => {
  const { unfollowUserId } = req.params;
  const currentUser = req.user.id;

  const userUnfollow = await prisma.user.findUnique({
    where: {
      id: Number(unfollowUserId),
    },
  });

  if (!userUnfollow) {
    return res.status(404).json({
      message: "User tidak Ditemukan",
    });
  }

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: Number(unfollowUserId),
          followingId: Number(currentUser),
        },
      },
    });

    //update count user following dan follower
    await prisma.user.update({
      where: {
        id: Number(unfollowUserId),
      },
      data: {
        followerCount: {
          increment: 1,
        },
      },
    });
    res.status(200).json({
      message: "User berhasil di unfollow",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server down",
      error,
    });
  }
};

export const getLimitUser = async (req, res) => {
  try {
    const currentUser = req.user.id;

    const followedUser = await prisma.follow.findMany({
      where: { followingId: currentUser },
      select: { followerId: true },
    });

    const followedIds = followedUser.map((f) => f.followerId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...followedIds, currentUser],
        },
      },
      select: {
        id: true,
        image: true,
        fullname: true,
        username: true,
      },
      take: 5,
      orderBy: {
        createAt: "desc",
      },
    });
    res.status(200).json({
      message: "5 user yang belum di follow",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
      error: error.message,
    });
  }
};

export const isFollowUser = async (req, res) => {
  try {
    const currentUser = req.user.id;
    const { followUserId } = req.params;

    const checkFollowUserId = await prisma.user.findUnique({
      where: {
        id: Number(followUserId),
      },
    });

    if (!checkFollowUserId) {
      return res.status(404).json({
        message: "User Tidak Ditemukan",
      });
    }

    const isFollowUserData = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(followUserId),
          followingId: currentUser,
        },
      },
    });

    if (isFollowUserData) {
      return res.status(200).json({
        data: true,
      });
    }

    return res.status(200).json({
      data: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Down",
      error,
    });
  }
};
