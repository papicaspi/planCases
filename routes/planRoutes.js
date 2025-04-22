const express = require('express');
const router = express.Router();
const controller = require('../controllers/planController');

// Crear un nuevo plan de mejora
router.post('/planes', controller.crearPlan);

// Obtener todos los planes de mejora
router.get('/planes', controller.obtenerPlanes);

// Obtener un plan de mejora por su indicador
router.get('/planes/:codigo', controller.obtenerPlanesIndicador);

// Obtener un plan de mejora por su id
router.get('/plan/:codigo', controller.obtenerPlaneId);

// Revisar un plan de mejora (aprobar o rechazar)
router.patch('/planes/:idPlan/revisar', controller.revisarPlan);

// Cambiar estado del indicador y de los planes
router.patch('/indicadores/:codigoId', controller.revisarIndicador);

module.exports = router;
