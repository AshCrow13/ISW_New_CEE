import { 
  createAsistenciaService,
  getAsistenciasService,
  getAsistenciaService,
  updateAsistenciaService,
  deleteAsistenciaService
} from "../services/asistencia.service.js";
import { getEstudianteService } from "../services/estudiante.service.js";
import { getInstanciaService } from "../services/instancias.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Create
export async function createAsistencia(req, res) {
  try {
    const { correo, idInstancia, clave } = req.body;
    
    // Validar existencia de estudiante
    const [estudiante, errEst] = await getEstudianteService({ email: correo });
    if (errEst) return handleErrorClient(res, 404, errEst);
    
    // Validar existencia de instancia
    const [instancia, errInst] = await getInstanciaService({ id: idInstancia });
    if (errInst) return handleErrorClient(res, 404, errInst);
    
    // Verificar que esté habilitada y clave coincida
    if (!instancia.AsistenciaAbierta) {
      return handleErrorClient(res, 403, "La asistencia no está habilitada");
    }
    
    if (instancia.ClaveAsistencia !== clave) {
      return handleErrorClient(res, 403, "Clave incorrecta");
    }
    
    // Registrar asistencia
    const nuevaAsistencia = { 
      correo, 
      idInstancia 
    };
    
    const [asistencia, err] = await createAsistenciaService(nuevaAsistencia);
    if (err) {
      if (err.includes("Ya existe")) {
        return handleErrorClient(res, 409, err);
      }
      return handleErrorServer(res, 500, err);
    }
    
    handleSuccess(res, 201, "Asistencia registrada con éxito", asistencia);
  } catch (error) {
    console.error("Error en createAsistencia:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Read all
export async function getAsistencias(req, res) {
  try {
    const [asistencias, err] = await getAsistenciasService(req.query);
    if (err) return handleErrorClient(res, 404, err);
    handleSuccess(res, 200, "Asistencias encontradas", asistencias);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Read one
export async function getAsistencia(req, res) {
  try {
    const { correo, idInstancia } = req.query;
    const [asistencia, err] = await getAsistenciaService({ correo, idInstancia });
    if (err) return handleErrorClient(res, 404, err);
    handleSuccess(res, 200, "Asistencia encontrada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Update
export async function updateAsistencia(req, res) {
  try {
    const { correo, idInstancia } = req.query;
    const [asistencia, err] = await updateAsistenciaService({ correo, idInstancia }, req.body);
    if (err) return handleErrorClient(res, 404, err);
    handleSuccess(res, 200, "Asistencia actualizada correctamente", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Delete
export async function deleteAsistencia(req, res) {
  try {
    const { correo, idInstancia } = req.query;
    const [asistencia, err] = await deleteAsistenciaService({ correo, idInstancia });
    if (err) return handleErrorClient(res, 404, err);
    handleSuccess(res, 200, "Asistencia eliminada correctamente", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}