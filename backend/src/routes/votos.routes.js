import {Router} from 'express';
import { 
    postVoto,
    getVotos,
    getConteo
 } from '../controllers/votos.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { hasCarreras } from '../middlewares/carrera.middleware.js';
import { hasRoles } from '../middlewares/roles.middleware.js';

 const router = Router();

router.post('/:votacionId/:opcionId', authenticateJwt, hasCarreras(["Ingeniería en Computación e Informática"]), hasRoles(["admin","vocalia","estudiante"]) ,postVoto);
router.get('/:votacionId/votos', authenticateJwt, hasCarreras(["Ingeniería en Computación e Informática"]), hasRoles(["admin","vocalia", "estudiante"]) ,getVotos)
router.get('/:votacionId/conteo', authenticateJwt, hasCarreras(["Ingeniería en Computación e Informática"]), hasRoles(["admin","vocalia","estudiante"]) ,getConteo);
export default router;