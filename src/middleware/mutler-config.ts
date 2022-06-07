import { Request } from 'express';
import multer, { diskStorage } from 'multer';


function ext(file: Express.Multer.File): string | undefined {
  if (file.mimetype === 'image/jpeg') {
    return '.jpeg';
  }
  if (file.mimetype === 'image/jpg') {
    return '.jpg'
  }
  if (file.mimetype === 'image/png') {
    return '.png'
  }

}

const stor = diskStorage({
  destination: (req: Request, file, callback) => { callback(null, 'src/images') },
  filename: function (req: Request, file, callback) {
    const extention = ext(file);
    if (typeof extention === 'string') {
      callback(null, String(Date.now()) + '-' + String(Math.round(Math.random() * 1E5)) + extention);
    }
  }
});



export default multer({
  storage: stor,
  fileFilter: (req, file, callback) => file.mimetype === 'image/png'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/jpg' ? callback(null, true) : callback(new Error("not a jpeg/jpg/png file"))
}).single('image');