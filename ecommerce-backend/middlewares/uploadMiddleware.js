const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '..', 'uploads');
const productsUploadsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(productsUploadsDir)) {
  fs.mkdirSync(productsUploadsDir);
}

// Configuration Multer pour les uploads d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = {
  upload,
  productsUploadsDir
}; 