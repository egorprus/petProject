import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// VPN adapters can push an unreliable DNS server that times out on SRV lookups
// used by mongodb+srv:// connection strings, so pin Node's resolver explicitly.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env") });
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import {
  PostController,
  UserController,
  BankController,
  CalendarController,
  MovieController,
} from "./controllers/index.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db ok"))
  .catch((err) => console.log("err", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

app.post("/login", handleValidationErrors, UserController.login);
app.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/user/:id", checkAuth, UserController.getUser);

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
app.post("/posts/:id/comments", checkAuth, PostController.addComment);

app.get("/bank-records", checkAuth, BankController.getAll);
app.post("/bank-records", checkAuth, BankController.create);
app.patch("/bank-records/:id", checkAuth, BankController.update);
app.delete("/bank-records/:id", checkAuth, BankController.remove);

app.get("/calendar-events", checkAuth, CalendarController.getAll);
app.post("/calendar-events", checkAuth, CalendarController.create);
app.patch("/calendar-events/:id", checkAuth, CalendarController.update);
app.delete("/calendar-events/:id", checkAuth, CalendarController.remove);

app.get("/movie-records", checkAuth, MovieController.getAll);
app.post("/movie-records", checkAuth, MovieController.create);
app.patch("/movie-records/:id", checkAuth, MovieController.update);
app.delete("/movie-records/:id", checkAuth, MovieController.remove);

app.get("/movie-records/share-link", checkAuth, MovieController.getShareLink);
app.post("/movie-records/share-link/regenerate", checkAuth, MovieController.regenerateShareLink);
app.get("/movie-records/shared/:token", MovieController.getShared);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.filename}`,
  });
});

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(process.env.PORT || 8080, () => {
  console.log("server ok");
});
