// backend/routes/panier.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// POST - Ajouter un produit au panier
router.post('/', async (req, res) => {
  const { id_utilisateur,id_produit, quantite } = req.body;
  try {
    await db.query(
      'INSERT INTO panier (id_utilisateur,id_produit, quantite) VALUES ($1, $2,$3)',
      [id_utilisateur,id_produit, quantite]
    );
    res.status(200).json({ message: 'Produit ajouté au panier' });
  } catch (err) {
    console.error('Erreur panier :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
