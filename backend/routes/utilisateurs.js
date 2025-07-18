const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db"); 
const router = express.Router();

router.post("/inscription", async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    // 🔒 Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // 🛢️ Insérer dans la base
    await pool.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES ($1, $2, $3, $4)",
      [nom, email, hashedPassword, "client"]
    );

    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    if (err.code === "23505") {
      res.status(409).json({ message: "Email déjà utilisé" });
    } else {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
});

module.exports = router;
