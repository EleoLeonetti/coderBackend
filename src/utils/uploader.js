const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        let folder

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            folder = 'src/public/images';
        } else if (file.mimetype === 'application/pdf') {
            folder = 'src/public/documents';
        } else {
            folder = 'src/uploads/others';
        }

        cb(null, folder)

    },

    filename: (req, file, cb) => {
        // Define el nombre del archivo
        cb(null, `${Date.now()}-${file.originalname}`);
    }
   
})

exports.uploader = multer({
    storage
})