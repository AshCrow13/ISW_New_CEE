import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configuración del storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // nombreUnico-timestamp.ext
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + "-" + Date.now() + ext);
    }
});

// Filtro de tipos permitidos (pdf, doc, docx, xlsx, jpg, png, etc)
function fileFilter(req, file, cb) {
    const allowed = [
        "application/pdf", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png"
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Tipo de archivo no permitido"), false);
    }
}

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

export default upload;
