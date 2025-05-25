import {Router} from 'express';
import { 
    postVoto,
    getVotos,
    getConteo
 } from '../controllers/votos.controller';
import { authenticateJwt } from '../middlewares/authentication.middleware';

 const router = Router();

router.post('/votacion/:votacionId/votar', authenticateJwt ,postVoto);
router.get('/votacion/:votacionId/votos', getVotos);
router.get('/votacion/:votacionId/conteo', getConteo);
export default router;