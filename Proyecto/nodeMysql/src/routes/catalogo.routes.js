// index.routes.js
import { Router } from 'express';
import { agregarpersonajeAlCarrito, mostrarCarrito, showCatalogo,Tokenauth} from '../controllers/users.controllers.js';

const router = Router();

router.get('/catalogo', showCatalogo);
router.get('/carrito', mostrarCarrito);

// Ruta para agregar al carrito
router.post('/agregarPersonajeAlCarrito', agregarpersonajeAlCarrito);

export default router;
