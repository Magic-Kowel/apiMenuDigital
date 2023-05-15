import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from "./config.js";

//routes
import restaurantRoutes from './routes/restaurant.routes.js';
import usuariosRoutes from './routes/user.routes.js';
const app = express();

app.use(cors());
app.use(morgan('short'));
app.use(express.json());
app.use('/api',restaurantRoutes);
app.use('/api',usuariosRoutes);
app.use((req,res, next) =>{
    res.status(404).json({
        message: 'endpoint not found'
    })
})
app.listen(PORT);
console.log(`server on port ${PORT}`);