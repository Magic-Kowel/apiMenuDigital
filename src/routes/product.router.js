import { Router } from "express";
import { getProducts } from "../controllers/producto/getProducts.js";
import { createProduct } from "../controllers/producto/createProduct.js";
import verifyToken from "../libs/verifyToken.js";
import uploadFile from "../libs/uploadFile.js";
const router = Router();

router.get('/products/:idSeccion',getProducts);
router.post('/product',verifyToken,uploadFile.single('file'),createProduct)
export default router;