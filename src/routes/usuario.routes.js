import {Router} from "express";
import verifyToken from "../libs/verifyToken.js";
import {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
} from "../controllers/usuario.controller.js";
const router = Router();
router.get('/usuarios',verifyToken,getUsers);
router.get('/usuario/:id',verifyToken,getUser);
router.post('/usuarios',createUser);
router.delete('/usuarios/:id',verifyToken,deleteUser);
router.patch('/usuarios/:id',verifyToken,updateUser);
export default router;