import { pool } from "../../db.js";
export const deleteSeccion = async (req,res) =>{
    try {
        const [result] = await pool.query('UPDATE seccion SET activo = 0 WHERE seccion_id = ?',[
            req.params.idSeccion
        ]);
        if(result.affectedRows <= 0){
            return res.status(404).json({
                message: 'Seccion not found'
            });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}