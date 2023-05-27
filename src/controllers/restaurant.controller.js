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
        on imagen.imagen_id = restaurante.fk_imagen_id
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
    console.log(token);
    const decodedToken = jwt.verify(token, SECRET_KEY);
    console.log(decodedToken);
    try {
        const [rows] = await pool.query(`SELECT 
        restaurante_id, nombre, path 
        FROM restaurante 
        LEFT JOIN imagen on fk_imagen_id = imagen_id 
        WHERE activo = 1 AND fk_usuario_id = ?`,[
            decodedToken.id
        ]);
        // if(rows.length <= 0){
        //     return res.status(404).json({
        //         message: 'Restaurant not found'
        //     })
        // }
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
    let connection;
    //lepasamos los parametros
    try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const imagenResponse = await connection.query(`INSERT INTO 
                imagen(path) 
                VALUES (?)`,[
                req.file.filename
            ]);
            console.log('imagenResponse',imagenResponse[0].insertId);
            await connection.query(`INSERT INTO 
            restaurante (
                nombre,
                fk_usuario_id,
                fk_imagen_id
                ) 
            VALUES (?,?,?)`,[
                name,
                decodedToken.id,
                imagenResponse[0].insertId
            ]);
            res.status(200).json({
                created:true,
                message:"Created with success"
            });
            await connection.commit();
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error(error);
        return res.status(500).json({
            created:false,
            message: 'Something goes wrong'
        })
    }finally{
        if (connection) {
            connection.release();
        }
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
export const updateRestaurant = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const { idRestaurant } = req.params;
        const { name } = req.body;
        const nameFile = req.file ? req.file.filename : null; // Obtener el nombre del archivo si existe, de lo contrario, establecerlo como null
  
        if (nameFile) {
            // Si se envió una imagen, se inserta en la base de datos
            const [rows] = await connection.query('INSERT INTO imagen (path) VALUES (?)', [nameFile]);
            await connection.query(
            `UPDATE restaurante 
            SET fk_imagen_id = IFNULL(?, fk_imagen_id)
            WHERE restaurante_id = ?`,
            [rows.insertId, idRestaurant]
            );
        }
  
        // Se actualiza el nombre del restaurante
        await connection.query(
            `UPDATE restaurante 
            SET nombre = ?
            WHERE restaurante_id = ?`,
            [name, idRestaurant]
        );
  
        await connection.commit();
        res.status(200).json({
            update: true,
            message: 'Update with success',
        });
    } catch (error) {
        await connection.rollback();
        return res.status(500).json({
            message: 'Something goes wrong',
            error: error,
        });
    } finally {
        connection.release();
    }
  };