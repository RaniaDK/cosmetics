const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Ajouter un produit
router.post('/', async (req, res) => {
  const { id_utilisateur, id_produit, quantite = 1 } = req.body;

  try {
    const produit = await db.query('SELECT prix FROM produits WHERE id = $1', [id_produit]);
    if (produit.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const prix = produit.rows[0].prix;
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

    res.status(200).json({ message: 'Produit ajouté dans le panier' });
  } catch (err) {
    console.error('Erreur lors de l’ajout au panier :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Récupérer le panier
router.get('/utilisateur/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "ID utilisateur invalide" });

  try {
    const result = await db.query(`
      SELECT p.id_produit, p.quantite, pr.nom, pr.prix
      FROM panier p
      JOIN produits pr ON p.id_produit = pr.id
      WHERE p.id_utilisateur = $1;
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération du panier :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// ✅ Récupérer le nombre total d'articles dans le panier
router.get('/count', async (req, res) => {
  const { id_utilisateur } = req.query;

  if (!id_utilisateur || isNaN(id_utilisateur)) {
    return res.status(400).json({ message: "ID utilisateur invalide" });
  }

  try {
    const result = await db.query(
      'SELECT COALESCE(SUM(quantite), 0) AS total FROM panier WHERE id_utilisateur = $1',
      [id_utilisateur]
    );

    res.json({ total: parseInt(result.rows[0].total, 10) });
  } catch (err) {
    console.error("Erreur lors de la récupération du total :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// ✅ Modifier la quantité d’un produit
router.put('/:id_utilisateur/:id_produit', async (req, res) => {
  const { id_utilisateur, id_produit } = req.params;
  const { quantite } = req.body;

  if (!quantite || isNaN(quantite) || quantite < 1) {
    return res.status(400).json({ message: "Quantité invalide" });
  }

  try {
    await db.query(
      "UPDATE panier SET quantite = $1 WHERE id_utilisateur = $2 AND id_produit = $3",
      [quantite, id_utilisateur, id_produit]
    );
    res.json({ message: "Quantité mise à jour" });
  } catch (err) {
    console.error("Erreur mise à jour quantité :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// ✅ Supprimer un produit du panier
router.delete('/:id_utilisateur/:id_produit', async (req, res) => {
  const id_utilisateur = parseInt(req.params.id_utilisateur, 10);
  const id_produit = parseInt(req.params.id_produit, 10);

  if (isNaN(id_utilisateur) || isNaN(id_produit)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const check = await db.query(
      'SELECT * FROM panier WHERE id_utilisateur = $1 AND id_produit = $2',
      [id_utilisateur, id_produit]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
    }

    await db.query(
      'DELETE FROM panier WHERE id_utilisateur = $1 AND id_produit = $2',
      [id_utilisateur, id_produit]
    );

    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur suppression produit du panier:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Vider tout le panier
router.delete('/utilisateur/:id_utilisateur', async (req, res) => {
  const id_utilisateur = parseInt(req.params.id_utilisateur, 10);

  if (isNaN(id_utilisateur)) {
    return res.status(400).json({ message: "ID utilisateur invalide" });
  }

  try {
    await db.query('DELETE FROM panier WHERE id_utilisateur = $1', [id_utilisateur]);
    res.status(200).json({ message: 'Panier vidé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
  }
});

module.exports = router;
