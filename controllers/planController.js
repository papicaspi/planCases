const PlanMejora = require('../models/PlanMejora');
const Indicador = require('../models/Indicador');

// Función auxiliar para buscar un plan por código
const buscarPlanPorIndicador = async (codigo) => {
  return await PlanMejora.find({ codigo_indicador: codigo });
};

// Función auxiliar para buscar un plan por código
const buscarPlanPorId = async (codigo) => {
  return await PlanMejora.findOne({ id_plan: codigo });
};

// Función auxiliar para buscar el indicador
const buscarIndicador = async (codigoInd) => {
  return await Indicador.findOne({ codigo: codigoInd });
};

exports.crearPlan = async (req, res) => {
  const { id_plan, codigo_indicador, estado_indicador, objetivo, actividades, autor, fecha_creacion } = req.body;

  // Validación básica
  if (! id_plan || !codigo_indicador || !estado_indicador || !objetivo || !autor || !fecha_creacion) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const nuevoPlan = new PlanMejora({
      id_plan,
      codigo_indicador,
      estado_indicador,
      objetivo,
      actividades,
      autor,
      fecha_creacion,
    });

    await nuevoPlan.save();
    res.status(201).json(nuevoPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el plan de mejora', error: error.message });
  }
};

exports.obtenerPlanes = async (req, res) => {
  try {
    const planes = await PlanMejora.find();
    res.status(200).json(planes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los planes de mejora', error: error.message });
  }
};

exports.obtenerPlanesIndicador = async (req, res) => {
  const { codigo } = req.params;

  try {
    const plan = await buscarPlanPorIndicador(codigo);
    if (!plan) {
      return res.status(404).json({ message: 'Indicador no encontrado' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el indicador', error: error.message });
  }
};

exports.obtenerPlaneId = async (req, res) => {
  const { codigo } = req.params;

  try {
    const plan = await buscarPlanPorId(codigo);
    if (!plan) {
      return res.status(404).json({ message: 'Plan de mejora no encontrado' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el plan de mejora', error: error.message });
  }
};

exports.revisarPlan = async (req, res) => {
  const { idPlan } = req.params; // ID del plan a revisar
  const { decision } = req.body; // "aprobado" o "rechazado"

  if (!['aprobado', 'rechazado'].includes(decision)) {
    return res.status(400).json({ message: 'Decisión inválida. Debe ser "aprobado" o "rechazado".' });
  }

  try {
    const plan = await buscarPlanPorId(idPlan);
    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    // Verificar si el plan ya tiene un estado final
    if (['aprobado', 'rechazado'].includes(plan.estado_plan)) {
      return res.status(400).json({ message: 'El plan ya ha sido revisado previamente.' });
    }

    // Actualizar el estado del plan
    plan.estado_plan = decision;
    await plan.save();

    res.status(200).json({ message: `El estado del plan se actualizó a "${decision}".` });
  } catch (err) {
    res.status(500).json({ error: 'Error al revisar el plan', details: err.message });
  }
};

// Si se aprueban los planes, actualizar el estado del indicador
exports.revisarIndicador = async (req, res) => {
  const { codigoId } = req.params; // Código del indicador
  const { estado } = req.body; // Nuevo estado

  // Validación del estado
  if (!['Satisfactorio', 'Cuasisatisfactorio','Deficiente'].includes(estado)) {
    return res.status(400).json({
      message: 'Estado inválido. Debe ser "Satisfactorio", "Deficiente" o "Cuasisatisfactorio".'
    });
  }

  try {
    // Actualizar el estado del indicador
    const indicador = await Indicador.findOneAndUpdate(
      { codigo: codigoId },
      { $set: { estado: estado } },
      { new: true } // Retorna el documento actualizado
    );

    if (!indicador) {
      return res.status(404).json({
        error: 'Indicador no encontrado para actualizar'
      });
    }

    // Actualizar el estado_indicador en todos los planes asociados
    const planesActualizados = await PlanMejora.updateMany(
      { codigo_indicador: codigoId },
      { $set: { estado_indicador: estado } }
    );

    res.status(200).json({
      message: `El estado del indicador y de los planes relacionados se actualizó a "${estado}".`,
      indicador,
      planesActualizados: {
        matchedCount: planesActualizados.matchedCount,
        modifiedCount: planesActualizados.modifiedCount,
      },
    });
  } catch (error) {
    console.error('Error al actualizar el estado del indicador y los planes:', error);
    res.status(500).json({
      error: 'Error al actualizar el estado del indicador y los planes',
      details: error.message,
    });
  }
};