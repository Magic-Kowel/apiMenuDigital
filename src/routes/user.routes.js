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
} from "../controllers/user.controller.js";
const router = Router();
router.get('/users',verifyToken,getUsers);
router.post('/user/login',loginUser);
router.get('/user/email/:email',validateEmail);
router.get('/user/:id',verifyToken,getUser);
router.post('/user',createUser);
router.delete('/user/:id',verifyToken,deleteUser);
router.patch('/user/:id',verifyToken,updateUser);
export default router;