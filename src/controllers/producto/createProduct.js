import { pool } from "../../db.js";
export const createProduct = async(req,res) =>{
    const {name,description,price,idSeccion} = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const imagenResponse = await connection.query(`INSERT INTO 
        imagen(path) 
        VALUES (?)`,[
        req.file.filename
    ]);
    const data =await connection.query(`INSERT INTO 
    producto (
        nombre,
        descripcion,
        price,
        fk_imagen_id,
        fk_seccion_id
    ) 
    VALUES (?,?,?,?,?)`,[
        name,
        description,
        price,
        imagenResponse[0].insertId,
        idSeccion
    ]);
    console.log(data);
    res.status(200).json({
        created:true,
        message:"Created with success"
    });
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