import express from 'express'
import GastoController from '../controllers/gasto.controller.js';

const router = express.Router();

router.post('/new',GastoController.createGasto)
router.get('/',GastoController.getAllGastos)
router.get('/:id',GastoController.getGasto)
router.put('/', GastoController.updateGasto)
router.delete('/:id',GastoController.deleteGasto)
router.get('/mounth_year/:monthYear',GastoController.getGastoMonthOfYear)



export default router