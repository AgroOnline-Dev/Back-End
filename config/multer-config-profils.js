const multer = require("multer");
const path = require("path");

const storageP = multer.diskStorage({
  destination: "./uploads/profils",
  filename: (req, file, cb) => {
    cb(
      null,
      `  ${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploadP = multer({ storage: storageP });
module.exports = uploadP;
