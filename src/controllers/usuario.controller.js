import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../config.js";
export const getUsers = async(req,res) =>{
    try {
        const [rows] = await pool.query("SELECT * FROM usuario");
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
export const getUser = async (req,res) =>{
    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?',[req.params.id])
        if(rows.length <= 0){
            return res.status(404).json({
                message: 'Employee not found'
            })
        }
        res.json(rows[0]);
    } catch (error) {
         return res.status(500).json({
             message: 'Something goes wrong'
         });
    }
 }
export const createUser = async (req,res)=>{
    try {
        const {nombre,apellidos,password,email} = req.body
        const salt = await bcrypt.genSalt(10);
        const passwordEncript = await bcrypt.hash(password, salt);
        const [rows] = await pool.query('INSERT INTO usuario (nombre,apellidos,PASSWORD,email)VALUES (?,?,?,?)',[
            nombre,
            apellidos,
            passwordEncript,
            email
        ]);
        const token = jwt.sign({
            id: rows.insertId,
        },
        SECRET_KEY,
        {
            expiresIn: 60 * 60 * 24
        })
        
        res.send({
            id:rows.insertId,
            nombre,
            apellidos,
            password,
            email,
            auth: true,
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
};
export const deleteUser = async (req,res)=>{
    try {
        const [result] = await pool.query('DELETE FROM usuario WHERE usuario_id = ?',[
            req.params.id
        ]);
        if(result.affectedRows <= 0){
            return res.status(404).json({
                message: 'Employee not found'
            });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}

export const updateUser = async (req,res)=>{
    try {
        const {id} = req.params;
        const {
            nombre,
            apellidos
        } = req.body;
        const [result] = await 
        pool.query('UPDATE usuario SET nombre = IFNULL(?,nombre), apellidos = IFNULL(?,apellidos) WHERE usuario_id = ?',
        [
            nombre,
            apellidos,
            id
        ]);
    
        if(result.affectedRows === 0){
            return res.status(404).json({
                message:'Employee not found'
            })
        }
        const [rows] = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?',[id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}