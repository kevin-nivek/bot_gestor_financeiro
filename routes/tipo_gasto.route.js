import express from 'express'
import TipoGastoController from '../controllers/tipo_gasto.controller.js';

const router = express.Router();

router.post('/new',TipoGastoController.createTipoGasto)
router.get('/',TipoGastoController.getAllTipoGastos)
router.get('/:id',TipoGastoController.getTipoGasto)
router.put('/', TipoGastoController.updateTipoGasto)

export default router