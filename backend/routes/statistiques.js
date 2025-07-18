const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/statistiques", async (req, res) => {
  try {
    const nbClients = await db.query("SELECT COUNT(*) FROM utilisateurs WHERE role = 'client'");
    const nbProduits = await db.query("SELECT COUNT(*) FROM produits");
    const NbCategories = await db.query("SELECT COUNT(*) FROM categories");
    const nbCommandes = await db.query("SELECT COUNT(*) FROM commandes");

    res.json({
      nb_clients: parseInt(nbClients.rows[0].count),
      nb_produits: parseInt(nbProduits.rows[0].count),
      nb_categories: parseInt(NbCategories.rows[0].count),
      nb_commandes: parseInt(nbCommandes.rows[0].count),
    });
  } catch (err) {
    console.error("Erreur stats :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
