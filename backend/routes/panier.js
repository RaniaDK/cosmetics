const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/', async (req, res) => {
  const { id_utilisateur, id_produit, quantite = 1 } = req.body;
  try {
    // Vérifier si le produit existe
    const produit = await db.query('SELECT prix FROM produits WHERE id = $1', [id_produit]);
    if (produit.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    const prix = produit.rows[0].prix;
    // Vérifier si le produit est déjà dans le panier de l'utilisateur
    const check = await db.query(
      'SELECT * FROM panier WHERE id_utilisateur = $1 AND id_produit = $2',
      [id_utilisateur, id_produit]
    );
    if (check.rows.length > 0) {
      await db.query(
        'UPDATE panier SET quantite = quantite + $1 WHERE id_utilisateur = $2 AND id_produit = $3',
        [quantite, id_utilisateur, id_produit]
      );
    } else {
      await db.query(
        'INSERT INTO panier (id_utilisateur, id_produit, quantite, prix) VALUES ($1, $2, $3, $4)',
        [id_utilisateur, id_produit, quantite, prix]
      );
    }
    res.status(200).json({ message: 'Produit ajouté ou mis à jour dans le panier' });
  } catch (err) {
    console.error('Erreur lors de l’ajout au panier :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.get('/utilisateur/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT p.id, pr.nom, pr.prix, p.quantite
      FROM panier p
      JOIN produits pr ON p.id_produit = pr.id
      WHERE p.id_utilisateur = $1
    `, [id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération du panier :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const check = await db.query('SELECT * FROM panier WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'produit non trouvée' });
    }

    await db.query('DELETE FROM panier WHERE id = $1', [id]);
    res.status(200).json({ message: 'produit supprimée avec succès' });
  } catch (err) {
    console.error('Erreur suppression produit:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
