import { pool } from "../../db.js";
export const getSeccion = async (req,res) =>{
    try {
        const [rows] = await pool.query(`SELECT 
        seccion_id,
        nombre,
        descripcion,
        path,
        fk_restaurante_id AS restaurante_id
        FROM seccion INNER  
        join imagen 
        on fk_imagen_id = imagen_id
        WHERE seccion_id = ? 
        and activo = 1`,[req.params.idSeccion])
        if(rows.length <= 0){
            return res.status(404).json({
                message: 'Seccion not found'
            })
        }
        res.json(rows);
    } catch (error) {
         return res.status(500).json({
             message: 'Something goes wrong'
         });
    }
}