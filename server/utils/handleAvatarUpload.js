import multer from "multer";

// SVG is excluded: it can carry scripts and would be served from our origin.
const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (_, file, cb) => cb(null, AVATAR_TYPES.includes(file.mimetype)),
}).single("avatar");

export default (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Файл больше 1 МБ"
            : "Не удалось загрузить файл",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        message: "Нужна картинка PNG, JPEG, WEBP или GIF",
      });
    }

    next();
  });
};
