const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/', async (req, res) => {
  const { id_utilisateur, client } = req.body;
  if (!client || !client.nom || !client.adresse || !client.telephone) {
    return res.status(400).json({ message: "❌ Informations client manquantes." });
  }
  try {
    const userResult = await db.query('SELECT * FROM utilisateurs WHERE id = $1', [id_utilisateur]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: '❌ Utilisateur introuvable' });
    }
    const panierResult = await db.query('SELECT * FROM panier WHERE id_utilisateur = $1', [id_utilisateur]);
    const panier = panierResult.rows;
    if (panier.length === 0) {
      return res.status(400).json({ message: '❌ Panier vide' });
    }
    let total = 0;
    for (const item of panier) {
      const produit = await db.query('SELECT prix FROM produits WHERE id = $1', [item.id_produit]);
      if (produit.rows.length === 0) continue;
      total += produit.rows[0].prix * item.quantite;
    }
    const commandeResult = await db.query(
      'INSERT INTO commandes (id_utilisateur, date_commande, total, statut, nom_client, adresse_livraison, telephone) VALUES ($1, NOW(), $2, $3, $4, $5, $6) RETURNING id',
      [id_utilisateur, total, 'En attente', client.nom, client.adresse, client.telephone]
    );
    const id_commande = commandeResult.rows[0].id;
    for (const item of panier) {
      await db.query(
        'INSERT INTO panier_archive (id_commande, id_utilisateur, id_produit, quantite) VALUES ($1, $2, $3, $4)',
        [id_commande, id_utilisateur, item.id_produit, item.quantite]
      );
    }
    await db.query('DELETE FROM panier WHERE id_utilisateur = $1', [id_utilisateur]);
    res.status(200).json({ message: '✅ Commande enregistrée (en attente)', id_commande });
  } catch (err) {
    console.error('Erreur création commande :', err.message);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
});


router.get('/', async (req, res) => {
  try {
    const commandes = await db.query(
      "SELECT * FROM commandes ORDER BY date_commande DESC"
    );
    res.json(commandes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put('/:id/statut', async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  try {
    const result = await db.query(
      'UPDATE commandes SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    if (statut === "Confirmée") {
      console.log("confirmé")
    const commande = await db.query(
      'SELECT id_utilisateur FROM commandes WHERE id = $1',
      [id]
    );
    const id_utilisateur = commande.rows[0].id_utilisateur;
    const historique = await db.query(
      `SELECT pa.id_produit, pa.quantite, p.prix
      FROM panier_archive pa
      JOIN produits p ON pa.id_produit = p.id
      WHERE pa.id_utilisateur = $1 AND pa.id_commande = $2`,
      [id_utilisateur, id]
    );
console.log("historique.rows",historique.rows)
    for (const item of historique.rows) {
      await db.query(
        'INSERT INTO commande_items (id_commande, id_produit, quantite, prix_unitaire) VALUES ($1, $2, $3, $4)',
        [id, item.id_produit, item.quantite, item.prix]
      );
      await db.query(
        'UPDATE produits SET stock = stock - $1 WHERE id = $2',
        [item.quantite, item.id_produit]
      );
    }
  }


    if (statut === "Annulée") {
      const items = await db.query(
        'SELECT id_produit, quantite FROM commande_items WHERE id_commande = $1',
        [id]
      );

      for (const item of items.rows) {
        await db.query(
          'UPDATE produits SET stock = stock + $1 WHERE id = $2',
          [item.quantite, item.id_produit]
        );
      }

      await db.query('DELETE FROM commande_items WHERE id_commande = $1', [id]);
    }

    res.json({ message: "Statut mis à jour avec succès", commande: result.rows[0] });
  } catch (err) {
    console.error("Erreur de mise à jour du statut :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




module.exports = router;
