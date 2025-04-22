const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  responsable: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  estado: { type: String, default: "pendiente" },
  presupuesto: { type: Number, required: false },
  evidencia: { type: String, required: false }
});

const planMejoraSchema = new mongoose.Schema({
  id_plan: { type: Number, required: true },
  codigo_indicador: { type: Number, required: true },
  estado_indicador: { type: String, required: true },
  objetivo: { type: String, required: true },
  actividades: [actividadSchema],
  autor: { type: String, required: true },
  fecha_creacion: { type: Date, required: true },
  estado_plan: { type: String, enum: ['pendiente', 'aprobado', 'rechazado'], default: 'pendiente' },
});

module.exports = mongoose.model('PlanMejora', planMejoraSchema, 'plan_mejora');
