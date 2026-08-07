import * as z from "zod";
import prisma from "../utils/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const jwtSecret = process.env.JWTSECRET;
export const RegisterUser = async (req, res) => {
  try {
    console.log("1");
    //Validation
    const userSchema = z.object({
      fullname: z.string().min(6, "Fullname minimal 8 karakter"),
      username: z.string().min(6, "username minimal 6 karakter"),
      email: z.string().email("email harus berformat email example@mail.com"),
      password: z.string().min(8, "password minimal 8 karaketer"),
    });

    console.log("2");

    const validated = userSchema.parse(req.body);

    console.log("3");

    // check apakah email dan username sudah terdaftar atau tidak

    const emailExisting = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (emailExisting) {
      return res.status(400).json({
        message: "Email sudah terdaftar silahkan masukkan email yang lain",
      });
    }

    const usernameExisting = await prisma.user.findUnique({
      where: {
        username: validated.username,
      },
    });

    console.log("4");

    if (usernameExisting) {
      return res.status(400).json({
        message: "Username sudah terdaftar silahkan masukkan email yang lain",
      });
    }

    // enkripsi password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(validated.password, salt);

    // insert data ke database
    const newUser = await prisma.user.create({
      data: {
        fullname: validated.fullname,
        username: validated.username,
        password: hashedPassword,
        email: validated.email,
      },
    });

    const token = jwt.sign({ id: newUser.id }, jwtSecret, {
      expiresIn: "6d",
    });

    return res.status(201).json({
      message: "register berhasil",
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
        bio: newUser.bio,
      },
      token: token,
    });
  } catch (err) {
    if (err instanceof Error && "issues" in err) {
      //zod
      const errors = err.issues.map((i) => i.message);
      return res.status(400).json({
        message: errors,
      });
    }

    //express
    console.log(err);
    res.status(500).json({ message: "Server Down" });
  }
};

export const LoginUser = async (req, res) => {
  try {
    // validation email dan password
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan Password wajib diisi",
      });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingEmail) {
      return res.status(400).json({
        message: "Email belum terdaftar silahkan register",
      });
    }

    // bandingkan password req body

    const comparePassword = bcrypt.compareSync(
      password,
      existingEmail.password,
    );

    if (!comparePassword) {
      return res.status(400).json({
        message: "invalid user",
      });
    }

    // buat jwt simpan id user ke jwt

    const token = jwt.sign({ id: existingEmail.id }, jwtSecret, {
      expiresIn: "6d",
    });

    // Res Success
    return res.status(201).json({
      data: {
        id: existingEmail.id,
        fullname: existingEmail.fullname,
        username: existingEmail.username,
        email: existingEmail.email,
        image: existingEmail.image,
        bio: existingEmail.bio,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Down" });
    error: message.error;
  }
};

export const GetUser = async (req, res) => {
  res.status(200).json({
    message: "Berhasil get User",
    data: req.user,
  });
};
