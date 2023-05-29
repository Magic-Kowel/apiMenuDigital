import { Router } from "express";
import uploadFile from "../libs/uploadFile.js";
import verifyToken from "../libs/verifyToken.js";
import { createSeccion } from "../controllers/seccion/seccionCreate.controller.js";
import { getSeccions } from "../controllers/seccion/getSeccions.controller.js";
import { deleteSeccion } from "../controllers/seccion/DeleteSeccion.controller.js";
const router = Router();
router.post('/seccion',
    verifyToken,
    uploadFile.single('file'),
    createSeccion
);
router.get('/seccions/:idRestaurant',verifyToken,getSeccions);
router.delete('/seccion/:idSeccion',verifyToken,deleteSeccion);
export default router;