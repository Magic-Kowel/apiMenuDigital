import { Router } from "express";
import verifyToken from "../libs/verifyToken.js";
import {
    getRestaurantes,
    getRestaurant,
    getRestaurantesUser,
    createRestaurante,
    deleteRestaurant
} from "../controllers/restaurant.controller.js";
const router = Router();
router.get('/restaurants',getRestaurantes);
router.get('/restaurant/:idRestaurant',verifyToken,getRestaurant);
router.get('/restaurants/user',verifyToken,getRestaurantesUser);
router.post('/restaurant',verifyToken,createRestaurante);
router.delete('/restaurant/:idRestaurant',verifyToken,deleteRestaurant);
export default router;