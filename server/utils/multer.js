const multer = require("multer");
const path = require("path");

function createStorage(subfolder) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads", subfolder));
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + "-" + file.fieldname + ext);
    },
  });
}

function createUpload(subfolder) {
  return multer({ storage: createStorage(subfolder) });
}

module.exports = { createUpload, createStorage };
