
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../config.js"
function verifyToken(req, res, next){
    const token = req.headers['x-access-token'];
    if(!token){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    jwt.verify(token, SECRET_KEY, (err,data) =>{
        if(err){
            res.sendStatus(403);
        }
    });
    next();
}
export default verifyToken;