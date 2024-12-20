import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

const connectToDatabase = async () => {
    if (process.env.USE_DATABASE === 'true') {
        try {
          if (!process.env.MONGODB_URI) {
            throw new Error("La variable de entorno MONGODB_URI no está definida");
          }
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('Conectado a MongoDB');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            process.exit(1);
        }
    }
    else {
        console.log('Base de datos omitida para este entorno');
    }
};

export default connectToDatabase;