import multer from "multer";
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`)
    }
})
const uploadFile = multer({storage});
export default uploadFile;