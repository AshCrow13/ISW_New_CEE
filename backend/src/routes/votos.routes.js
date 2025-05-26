import {Router} from 'express';
import { 
    postVoto,
    getVotos,
    getConteo
 } from '../controllers/votos.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';

 const router = Router();

router.post('/:votacionId/votar', authenticateJwt ,postVoto);
router.get('/:votacionId/votos', authenticateJwt, getVotos)
router.get('/:votacionId/conteo', authenticateJwt, getConteo);
export default router;