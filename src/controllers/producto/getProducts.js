import { pool } from "../../db.js";
export const getProducts = async (req,res) =>{
    try {
        const [rows] = await pool.query(`SELECT 
        producto_id,
        fk_seccion_id,
        imagen.path,
        nombre,
        descripcion,
        price 
        FROM producto
        INNER JOIN imagen
        on fk_imagen_id = imagen_id
        WHERE fk_seccion_id = ? 
        and activo = 1`,[req.params.idSeccion])
        console.log(rows);
        if(rows.length <= 0){
            return res.status(404).json({
                message: 'producto not found'
            })
        }
        res.json(rows);
    } catch (error) {
         return res.status(500).json({
             message: 'Something goes wrong'
         });
    }
}