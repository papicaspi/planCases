cambia el env. para conectarte a la base de mongo
yo usé el atlas de mongo para conectarme 
MONGO_URI=mongodb+srv://stevenq:mongoPass@cluster0.ygmcumi.mongodb.net/cases?retryWrites=true&w=majority&appName=Cluster0

las rutas de la api se encuentran en route/planRoutes.js

un resumen rapido de la api.
puedes obtener los planes de mejora relacionados a un indicador, luego puedes seleccionar un plan especifico con su id(id_plan)
tambien puedes crear un plan de mejora
este es un insert en un plan de mejoras, solo cambia el id_plan para cada plan y relacionalo al indicador con codigo_indicador
{
  "id_plan": 1, //id del plan unico
  "codigo_indicador": 1,  //id o codigo del indicador
  "estado_indicador": "pendiente",
  "objetivo": "Mejorar el rendimiento del equipo",
  "actividades": [
    {
      "descripcion": "Capacitación del equipo",
      "responsable": "Juan Pérez",
      "fecha_inicio": "2025-04-22",
      "fecha_fin": "2025-05-22",
      "estado": "pendiente",
      "presupuesto": 50.00
    }
  ],
  "autor": "Admin",
  "fecha_creacion": "2025-04-22",
  "estado_plan": "pendiente"
}

puedes aprobar un plan con el id de ese plan
despues de aprobar todos los planes se debe cambiar el estado del indicador a satisfactorio y se cambiaria el estado_indicador en todos los planes relacionados a ese indicador
