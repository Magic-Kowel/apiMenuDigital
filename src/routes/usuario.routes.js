import {Router} from "express";
import verifyToken from "../libs/verifyToken.js";
import {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    validateEmail,
    loginUser
} from "../controllers/usuario.controller.js";
const router = Router();
router.get('/usuarios',verifyToken,getUsers);
router.post('/usuarios/login',loginUser);
router.get('/usuarios/email/:email',validateEmail);
router.get('/usuario/:id',verifyToken,getUser);
router.post('/usuarios',createUser);
router.delete('/usuarios/:id',verifyToken,deleteUser);
router.patch('/usuarios/:id',verifyToken,updateUser);
export default router;