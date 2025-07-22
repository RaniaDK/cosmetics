const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /commandes
router.post('/', async (req, res) => {
  const { id_utilisateur, produits, client } = req.body;

  if (!id_utilisateur || !produits || produits.length === 0 || !client) {
    return res.status(400).json({ message: 'Données incomplètes pour la commande.' });
  }

  try {
    // 1. Insérer la commande (client info en plus)
    const result = await db.query(
      `INSERT INTO commandes (id_utilisateur, date_commande, statut, total, nom_client, adresse_livraison, telephone)
       VALUES ($1, NOW(), 'en attente', 0, $2, $3, $4) RETURNING id`,
      [id_utilisateur, client.nom, client.adresse, client.telephone]
    );

    const commandeId = result.rows[0].id;
    let total = 0;

    // 2. Insérer chaque produit dans commande_items
    for (const item of produits) {
        console.log(item.id_produit)
      const produit = await db.query('SELECT prix FROM produits WHERE id = $1', [item.id_produit]);

      if (produit.rows.length === 0) {
        return res.status(404).json({ message: `Produit ${item.id_produit} non trouvé.` });
      }

      const prix = produit.rows[0].prix;
      const ligneTotal = prix * item.quantite;
      total += ligneTotal;

      await db.query(
        `INSERT INTO commande_items (id_commande, id_produit, quantite, prix_unitaire)
         VALUES ($1, $2, $3, $4)`,
        [commandeId, item.id_produit, item.quantite, prix]
      );
    }

    // 3. Mettre à jour le total de la commande
    await db.query(`UPDATE commandes SET total = $1 WHERE id = $2`, [total, commandeId]);

    res.status(201).json({ message: '✅ Commande enregistrée avec succès', commandeId });
  } catch (err) {
    console.error('❌ Erreur lors de la commande :', err);
    res.status(500).json({ message: 'Erreur serveur lors de l’enregistrement de la commande.' });
  }
});

module.exports = router;
