import { Router } from "express";
import uploadFile from "../libs/uploadFile.js";
import verifyToken from "../libs/verifyToken.js";
import {
    getRestaurantes,
    getRestaurant,
    getRestaurantesUser,
    createRestaurante,
    deleteRestaurant,
    updateRestaurant
} from "../controllers/restaurant.controller.js";
const router = Router();
router.get('/restaurants',getRestaurantes);
router.get('/restaurant/:idRestaurant',verifyToken,getRestaurant);
router.get('/restaurants/user',verifyToken,getRestaurantesUser);
router.post('/restaurant',verifyToken,uploadFile.single('file'),createRestaurante);
router.delete('/restaurant/:idRestaurant',verifyToken,deleteRestaurant);
router.patch('/restaurant/:idRestaurant',verifyToken,uploadFile.single('file'),updateRestaurant);
export default router;