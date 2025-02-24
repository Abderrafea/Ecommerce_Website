const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { uploadImage, getUploadedFiles } = require('../controllers/uploadController');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Route d'upload d'image (protégée par token et admin)
router.post('/upload-image', verifyToken, isAdmin, upload.single('image'), uploadImage);

// Route de test pour vérifier les uploads (protégée par admin)
router.get('/test-uploads', verifyToken, isAdmin, getUploadedFiles);

module.exports = router; 