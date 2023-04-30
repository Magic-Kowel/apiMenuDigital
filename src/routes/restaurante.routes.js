import { Router } from "express";
import {
    getRestaurantes
} from "../controllers/restaurante.controller.js";
const router = Router();
router.get('/restaurantes',getRestaurantes);

export default router;