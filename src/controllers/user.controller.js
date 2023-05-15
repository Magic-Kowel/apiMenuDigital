import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../config.js";
export  const loginUser = async(req,res) =>{
    try {
        const {email,password} = req.body;
        console.log(req.body);
        const [row] = await pool.query(`SELECT 
            usuario_id,email,PASSWORD,permiso
            FROM
            usuario
            INNER join permisos 
            on usuario.fk_permiso_id = permisos.permiso_id
            WHERE email = ? AND activo = 1`,[email]);
        if(row.length){
            const isPasswordValid = await bcrypt.compare(password, row[0].PASSWORD);
            if(row[0].email == email && isPasswordValid){
                const token = jwt.sign({
                    id: row[0].usuario_id,
                    permiso: row[0].permiso
                },
                SECRET_KEY,
                {
                    expiresIn: 60 * 60 * 24
                })
                return res.json({
                    idUser: row[0].usuario_id,
                    message: 'Logged in successfully',
                    auth: true,
                    token: token
                });
            }
        }
        return res.status(200).json({ 
            message: 'Incorrect email or password',
            logged:false 
        });
    } catch (error) {
        console.log(error);
    }
}
export const getUsers = async(req,res) =>{
    try {
        const [rows] = await pool.query("SELECT * FROM usuario where activo = 1");
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
export const validateEmail = async(req,res)=>{
    const [row] = await pool.query('SELECT count(*) as email FROM usuario WHERE email = ? ',[req.params.email]);
    if(row[0].email >=1){
        return res.status(200).json({
            exists:1,
            message: 'mail already exists'
        })
    }else{
        return res.status(200).json({
            exists:0,
            message: 'mail not exists'
        })
    }
}
export const getUser = async (req,res) =>{
    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE activo = 1 AND usuario_id = ?',[req.params.id])
        if(rows.length <= 0){
            return res.status(404).json({
                message: 'User not found'
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
        const {nombre,apellidos,password,email} = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordEncript = await bcrypt.hash(password, salt);
        const [rows] = await pool.query(
            'INSERT INTO usuario (nombre,apellidos,PASSWORD,email,fk_permiso_id)VALUES (?,?,?,?,2)',[
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
        const [result] = await pool.query('UPDATE usuario SET activo = 0 WHERE usuario_id = ?',[
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