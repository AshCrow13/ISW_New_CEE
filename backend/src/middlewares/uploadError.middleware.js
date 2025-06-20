export function uploadErrorHandler(err, req, res, next) {
    if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
            // Archivo demasiado grande
            return res.status(400).json({
                success: false,
                message: "El archivo es demasiado grande. Máximo permitido: 5MB."
            });
        }
        if (err.message === "Tipo de archivo no permitido") {
            // Tipo de archivo no permitido
            return res.status(400).json({
                success: false,
                message: "Tipo de archivo no permitido. Solo se aceptan PDF, Word, Excel, JPG y PNG."
            });
        }
        // Otros errores
        return res.status(400).json({
            success: false,
            message: "Error al subir el archivo: " + err.message
        });
    }
    next();
}
