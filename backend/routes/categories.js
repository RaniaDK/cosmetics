const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const upload = multer();



// ✅ GET - Toutes les catégories
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des catégories:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ GET - Une catégorie par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération de la catégorie:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ POST - Ajouter une catégorie (FormData)
router.post('/', upload.none(), async (req, res) => {
  const { nom } = req.body;
  if (!nom) {
    return res.status(400).json({ message: 'Le nom est obligatoire' });
  }

  try {
    const result = await db.query('INSERT INTO categories (nom) VALUES ($1) RETURNING *', [nom]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'ajout de la catégorie:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ PUT - Modifier une catégorie (FormData)
router.put('/:id', upload.none(), async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ message: 'Le nom est requis' });
  }

  try {
    const check = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    const result = await db.query('UPDATE categories SET nom = $1 WHERE id = $2 RETURNING *', [nom, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur modification catégorie:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ DELETE - Supprimer une catégorie
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const check = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    await db.query('DELETE FROM categories WHERE id = $1', [id]);
    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  } catch (err) {
    console.error('Erreur suppression catégorie:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
