import express, { Request, Response, NextFunction } from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import swaggerUi from 'swagger-ui-express';
    import swaggerDocument from './swagger.json';
    import listEndpoints from 'express-list-endpoints';
    import menuRoutes from './routes/menuRoutes';
    
    dotenv.config();
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    app.use(cors());
    app.use(express.json());
    
    // Rutas de la API
    app.use('/api', menuRoutes);
    
    // Ruta para la documentación Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    // Ruta principal de la API
    app.get('/', (req: Request, res: Response) => {
      const tempApp = express();
      tempApp.use(menuRoutes);
      const routes = listEndpoints(tempApp);
      res.json({ routes });
    });
    
    
    app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });
    
    export default app;