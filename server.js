import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import bannerRoutes from "./routes/banner.routes.js";

const app = express();

const allowedOrigins = [
  "https://ecommercelux.netlify.app",
  "https://admin-dash-fpkofole0-mteverest182-ui.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(port, () => {
  console.log(`server sedang berjalan di port ${port}`);
});
