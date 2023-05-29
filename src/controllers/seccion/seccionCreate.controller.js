import { pool } from "../../db.js";
export const createSeccion = async(req, res) =>{
    const {name,descripcion,idRestaurant} = req.body;
    console.log(name,descripcion,idRestaurant);
    let connection;
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
            seccion (
                nombre,
                descripcion,
                fk_imagen_id,
                fk_restaurante_id
            ) 
            VALUES (?,?,?,?)`,[
                name,
                descripcion,
                imagenResponse[0].insertId,
                idRestaurant
            ]);
            res.status(200).json({
                created:true,
                message:"Created with success"
            });
            // await connection.commit();
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