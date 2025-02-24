# Ecommerce_Website

Une application e-commerce complète avec backend Node.js/Express et frontend Vue.js 3.

## Description

Ce projet est une plateforme e-commerce complète développée avec une architecture moderne. Elle comprend un backend robuste avec Node.js/Express et MongoDB, et un frontend réactif avec Vue.js 3 et Tailwind CSS.

## Fonctionnalités

### Utilisateurs
- Inscription et connexion sécurisées
- Gestion de profil utilisateur
- Historique des commandes
- Panier d'achat persistant

### produits
- Catalogue de produits avec images
- Recherche et filtrage par catégories
- Détails complets des produits
- Gestion des stocks

### Panier et Commandes
- Ajout/suppression d'articles
- Calcul automatique des totaux
- Processus de commande sécurisé
- Suivi des commandes

### Administration
- Dashboard administrateur
- Gestion des produits (CRUD)
- Gestion des utilisateurs
- Gestion des commandes
- Upload d'images avec Cloudinary

## Technologies utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **Multer** - Upload de fichiers
- **Cloudinary** - Stockage d'images
- **CORS** - Cross-origin resource sharing

### Frontend
- **Vue.js 3** - Framework JavaScript progressif
- **Vue Router** - Routage côté client
- **Axios** - Client HTTP
- **Tailwind CSS** - Framework CSS utilitaire
- **Vue CLI** - Outils de développement

## Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- MongoDB (local ou Atlas)
- npm

### Backend

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd Ecommerce_Website/ecommerce-backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   Créer un fichier `.env` dans le dossier `ecommerce-backend` :
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=votre_secret_jwt
   CLOUDINARY_CLOUD_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   ```

4. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

### Frontend

1. **Naviguer vers le dossier frontend**
   ```bash
   cd ../ecommerce-frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer l'application**
   ```bash
   npm run serve
   ```

## Configuration

### MongoDB
- Assurez-vous que MongoDB est installé et en cours d'exécution
- Ou utilisez MongoDB Atlas pour une base de données cloud

### Cloudinary
- Créez un compte sur Cloudinary (https://cloudinary.com/)
- Récupérez vos clés d'API dans le dashboard
- Ajoutez-les dans le fichier `.env`

## Utilisation

1. **Démarrage complet**
   ```bash
   # Terminal 1 - Backend
   cd ecommerce-backend
   npm run dev

   # Terminal 2 - Frontend
   cd ecommerce-frontend
   npm run serve
   ```

2. **Accès à l'application**
   - Frontend : http://localhost:8080
   - Backend API : http://localhost:5000

3. **Compte administrateur**
   - Créez un utilisateur via l'API
   - Modifiez manuellement le rôle en base de données pour `admin: true`

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détail d'une commande

### Upload
- `POST /api/upload` - Upload d'images