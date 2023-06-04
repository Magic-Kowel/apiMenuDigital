import { pool } from "../../db.js";
export const updateSeccion = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const { name,descripcion,idSeccion } = req.body;
        const nameFile = req.file ? req.file.filename : null; // Obtener el nombre del archivo si existe, de lo contrario, establecerlo como null
  
        if (nameFile) {
            // Si se envió una imagen, se inserta en la base de datos
            const [rows] = await connection.query('INSERT INTO imagen (path) VALUES (?)', [nameFile]);
            await connection.query(
            `UPDATE seccion 
            SET fk_imagen_id = IFNULL(?, fk_imagen_id)
            WHERE seccion_id = ?`,
            [rows.insertId, idSeccion]
            );
            console.log();
        }
  
        // Se actualiza el nombre del restaurante
        await connection.query(
            `UPDATE seccion 
            SET nombre = IFNULL(?,nombre),
            descripcion = IFNULL(?,descripcion)
            WHERE seccion_id = ?`,
            [name,descripcion, idSeccion]
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