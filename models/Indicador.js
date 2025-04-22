const mongoose = require('mongoose');

const indicadorSchema = new mongoose.Schema({
  codigo: Number,
  nombre: String,
  tipo: String,
  estado: {
    type: String,
    enum: ['Satisfactorio', 'Cuasisatisfactorio', 'Deficiente']
  }
});

module.exports = mongoose.model('Indicador', indicadorSchema, 'indicador');
