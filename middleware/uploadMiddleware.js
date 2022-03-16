const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

var upload = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 2 },
});

export const uploadMiddleware = upload.array("parts[]", 50);
