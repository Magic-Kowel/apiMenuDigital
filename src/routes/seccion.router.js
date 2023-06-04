import { Router } from "express";
import uploadFile from "../libs/uploadFile.js";
import verifyToken from "../libs/verifyToken.js";
import { createSeccion } from "../controllers/seccion/seccionCreate.controller.js";
import { getSeccions } from "../controllers/seccion/getSeccions.controller.js";
import { deleteSeccion } from "../controllers/seccion/DeleteSeccion.controller.js";
import { getSeccion } from "../controllers/seccion/getSeccion.controller.js";
import { updateSeccion } from "../controllers/seccion/UpdateSeccion.controller.js";
const router = Router();
router.post('/seccion',
    verifyToken,
    uploadFile.single('file'),
    createSeccion
);
router.get('/seccions/:idRestaurant',verifyToken,getSeccions);
router.get('/seccion/:idSeccion',verifyToken,getSeccion);
router.delete('/seccion/:idSeccion',verifyToken,deleteSeccion);
router.patch('/seccion',
    verifyToken,
    uploadFile.single('file'),
    updateSeccion
);
export default router;