const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    console.log('=== DÉBUT UPLOAD CLOUDINARY ===');
    console.log('Fichier reçu:', req.file);
    
    if (!req.file) {
      console.log('ERREUR: Aucun fichier reçu');
      return res.status(400).json({ message: 'Aucune image fournie' });
    }
    
    console.log('Fichier path:', req.file.path);
    console.log('Fichier mimetype:', req.file.mimetype);
    console.log('Fichier size:', req.file.size);
    
    // Upload vers Cloudinary
    console.log('Début upload vers Cloudinary...');
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    console.log('Upload Cloudinary réussi:', result.secure_url);
    
    res.json({ 
      message: 'Image uploadée avec succès',
      imageUrl: result.secure_url 
    });
  } catch (error) {
    console.error('=== ERREUR UPLOAD CLOUDINARY ===');
    console.error('Erreur complète:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Erreur lors de l\'upload', error: error.message });
  }
};

exports.getUploadedFiles = async (req, res) => {
  try {
    // Lister les images dans le dossier products sur Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'products/',
      max_results: 10
    });
    
    res.json({ 
      message: 'Images Cloudinary accessibles',
      filesCount: result.resources.length,
      files: result.resources.map(resource => ({
        name: resource.public_id,
        url: resource.secure_url,
        size: resource.bytes
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur accès Cloudinary', error: error.message });
  }
}; 