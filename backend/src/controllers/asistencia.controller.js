
/*import getInstancia from "../controllers/instancias.controller.js"
import getEstudiante from "../controllers/estudiante.controller.js"


export async function registrarAsistencia(req, res) {

  try {
    const { correo, idInstancia, clave } = req.body;

    // Validar que el estudiante existe
    const estudianteRepo = getEstudiante(correo);
    if (!estudianteRepo) return res.status(404).json({ message: "Estudiante no encontrado" });

    // Validar que la instancia existe
    const instanciaRepo = getInstancia(idInstancia);
    if (!instanciaRepo) return res.status(404).json({ message: "Instancia no encontrada" });

    // Verificar que esté habilitada y clave coincida
    if (!instanciaRepo.asistenciaAbierta)
      return res.status(403).json({ message: "La asistencia no está habilitada" });

    if (instanciaRepo.claveAsistencia !== clave)
      return res.status(403).json({ message: "Clave incorrecta" });

    // Verificar que no esté ya registrada
    const yaRegistrado = await asistenciaRepo.findOneBy({ correo, idInstancia });
    if (yaRegistrado)
      return res.status(409).json({ message: "Ya registrado en esta instancia" });

    // Registrar asistencia
    const nuevaAsistencia = asistenciaRepo.create({ correo, idInstancia });
    await asistenciaRepo.save(nuevaAsistencia);

    res.status(201).json({ message: "Asistencia registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// READ (Uno)
export async function getAsistencia(req, res, correo, idInstancia) {
    try {
        
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [instancia, err] = await getInstanciaService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        handleSuccess(res, 200, "Instancia encontrada", instancia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}*/