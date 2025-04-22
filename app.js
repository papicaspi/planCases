const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet()); // Seguridad básica
app.use(cors()); // Permitir solicitudes desde otros orígenes

// Rutas
const planRoutes = require('./routes/planRoutes');
app.use('/api', planRoutes);

// Validar variables de entorno
if (!process.env.MONGO_URI || !process.env.PORT) {
  console.error('❌ Faltan variables de entorno necesarias (MONGO_URI o PORT)');
  process.exit(1); // Salir del proceso si faltan variables
}

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://cases:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1); // Salir del proceso si la conexión falla
  });
