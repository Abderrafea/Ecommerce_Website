module.exports = (req, res, next) => {
  console.log('Vérification admin pour utilisateur:', {
    userId: req.user?.id,
    userRole: req.user?.role,
    isAdmin: req.user?.role === 'admin'
  });

  if (req.user && req.user.role === 'admin') {
    console.log('Accès admin autorisé');
    next();
  } else {
    console.log('Accès admin refusé');
    res.status(403).json({ message: 'Admin access only' });
  }
};