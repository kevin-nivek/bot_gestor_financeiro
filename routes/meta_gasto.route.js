import express from 'express'
import MetaGastoController from '../controllers/meta_gasto.controller.js';

const router = express.Router();

router.post('/new',MetaGastoController.createMetaGasto)
router.get('/',MetaGastoController.getAllMetaGasto)
router.get('/:id',MetaGastoController.getMetaGasto)
router.put('/', MetaGastoController.updateMetaGasto)
router.delete('/:id',MetaGastoController.deleteMetaGasto)

export default router
