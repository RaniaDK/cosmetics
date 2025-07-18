const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Chemin absolu vers le dossier images
const imagesDir = path.join(__dirname, '..', 'images');

// Crée le dossier images s'il n'existe pas
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configuration multer pour enregistrer dans /images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// GET tous les produits
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.nom AS categorie_nom
      FROM produits p
      LEFT JOIN categories c ON p.categorie_id = c.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur de récupération des produits', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET un produit par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`SELECT p.*, c.nom AS categorie_nom FROM produits p 
      LEFT JOIN categories c ON p.categorie_id = c.id WHERE p.id = $1 `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur récupération produit par ID :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST - Ajouter un produit
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { nom, description, prix, stock, categorie_id } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!nom || !description || !prix || !stock || !categorie_id) {
      return res.status(400).json({ message: 'Certains champs sont manquants (nom, description, prix, stock, categorie_id).' });
    }
    if (!image_url) {
      return res.status(400).json({ message: "L'image est obligatoire." });
    }

    const query = `
      INSERT INTO produits (nom, description, prix, stock, categorie_id, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [nom, description, prix, stock, categorie_id, image_url];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'ajout du produit", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE - Supprimer un produit
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const check = await db.query('SELECT * FROM produits WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    // Supprimer l'image du serveur
    const image_url = check.rows[0].image_url;
    const imagePath = path.join(imagesDir, image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await db.query('DELETE FROM produits WHERE id = $1', [id]);
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du produit :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT - Modifier un produit
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const produit = await db.query('SELECT * FROM produits WHERE id = $1', [id]);
    if (produit.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    let image_url = produit.rows[0].image_url;

    if (req.file) {
      // Supprimer l'ancienne image
      const ancienImagePath = path.join(imagesDir, image_url);
      if (fs.existsSync(ancienImagePath)) {
        fs.unlinkSync(ancienImagePath);
      }
      image_url = req.file.filename;
    }


    const { nom, description, prix, stock, categorie_id } = req.body;

    const query = `UPDATE produits SET nom = $1, description = $2, prix = $3,
      stock = $4, categorie_id = $5, image_url = $6 WHERE id = $7 RETURNING *`;

    const values = [nom, description, prix, stock, categorie_id, image_url, id];
    const result = await db.query(query, values);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur modification produit:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
