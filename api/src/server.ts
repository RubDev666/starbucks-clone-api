import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger.json';
import swaggerTestJson from '../swagger-test.json'

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

console.log('Servidor iniciado...');
app.use(cors());
app.use(express.json());
console.log('Middleware configurado...');
 // Documentación de Swagger UI en /api-docs
console.log('Tipo de swaggerJson:', typeof swaggerJson);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

// Documentación de Swagger UI de prueba en /test-docs
console.log('Tipo de swaggerTestJson:', typeof swaggerTestJson);
app.use('/test-docs', swaggerUi.serve, swaggerUi.setup(swaggerTestJson));


// Root route
app.get('/', (req, res) => {
    res.send('API is running');
});
console.log('Ruta root configurada...');
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
console.log('Escuchando el servidor...');

export default app;