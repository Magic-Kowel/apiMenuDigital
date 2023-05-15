import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../config.js";
export const getRestaurantes = async(req,res) =>{
    try {
        const [rows] = await pool.query("SELECT * FROM restaurante WHERE activo = 1");
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
export const getRestaurant = async (req,res) =>{
    try {
        const [rows] = await pool.query(`SELECT 
        restaurante_id,
        nombre,
        path 
        FROM restaurante 
        LEFT join imagen 
        on imagen.imagen_id = restaurante.restaurante_id
        WHERE activo = 1
        AND restaurante_id = ?`,[req.params.idRestaurant])
        if(rows.length <= 0){
            return res.status(404).json({
                message: 'Restaurant not found'
            })
        }
        res.json(rows[0]);
    } catch (error) {
         return res.status(500).json({
             message: 'Something goes wrong'
         });
    }
}
export const getRestaurantesUser = async(req,res) =>{
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    try {
        const [rows] = await pool.query(`SELECT 
        restaurante_id, nombre, path 
        FROM restaurante 
        LEFT JOIN imagen on fk_imagen_id = imagen_id 
        WHERE activo = 1 AND fk_usuario_id = ?`,[
            decodedToken.id
        ]);
        if(rows.length <= 0){
            return res.status(404).json({
                message: 'Restaurant not found'
            })
        }
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
export const createRestaurante = async(req, res) =>{
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const {name} = req.body;
    try {
         pool.query(`INSERT INTO 
        restaurante (nombre,fk_usuario_id) 
        VALUES (?,?)`,[
            name,
            decodedToken.id
        ]);
        res.status(200).json({
            created:true,
            message:"Created with success"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            created:false,
            message: 'Something goes wrong'
        })
    }
}
export const deleteRestaurant = async (req,res) =>{
    try {
        const [result] = await pool.query('UPDATE restaurante SET activo = 0 WHERE restaurante_id = ?',[
            req.params.idRestaurant
        ]);
        if(result.affectedRows <= 0){
            return res.status(404).json({
                message: 'Restaurant not found'
            });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}