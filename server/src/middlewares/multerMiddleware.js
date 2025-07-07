const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:\\Users\\vyshn\\OneDrive\\Desktop\\slow-learners\\server\\uploads\\materials')
    },
    filename: function (req, file, cb) {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniquePrefix + "-" + file.originalname);
    }
  })
  
exports. upload = multer({ storage: storage })