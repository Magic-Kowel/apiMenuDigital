import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from "./config.js";

//routes
import restaurantRoutes from './routes/restaurant.routes.js';
import seccionRoutes from './routes/seccion.router.js';
import productRoutes from './routes/product.router.js';
import usuariosRoutes from './routes/user.routes.js';
import fileRoutes from "./routes/files.routes.js";
const app = express();

app.use(cors());
app.use(morgan('short'));
app.use(express.json());
//apis
app.use('/api',restaurantRoutes);
app.use('/api',seccionRoutes);
app.use('/api',productRoutes);
app.use('/api',usuariosRoutes);
// imagenes
app.use(express.static('./uploads'));
app.use(fileRoutes);

app.use((req,res, next) =>{
    res.status(404).json({
        message: 'endpoint not found'
    })
})
app.listen(PORT);
console.log(`server on port ${PORT}`);