const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpg':'jpg',
  'image/jpeg':'jpg'
}
const storage = multer.diskStorage({
  destination:(req,file,cb) =>
  {
    const isValid  = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type');
    if(isValid)
    {
      error = null;
    }
    cb(error,"images");
  },
  filename:(req,file,cb) =>
  {
   const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
   const extesnion = MIME_TYPE_MAP[file.mimetype];
   cb(null,name+ '-'+Date.now()+'.'+extesnion );
  }
})

module.exports = multer({storage:storage}).single('image');
