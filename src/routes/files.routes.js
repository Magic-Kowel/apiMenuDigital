import {Router} from "express";
import path  from 'path';
const router = Router();
router.get('/api/:img', function(req, res){
    const img = req.params.img
    res.sendFile( path.resolve(`uploads/${img}` ));
});
export default router;