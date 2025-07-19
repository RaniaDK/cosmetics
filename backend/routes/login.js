const express = require("express");
const router = express.Router();
const db = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  // <-- ajouté ici

router.post("/login", async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const result = await db.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign({ id: user.id, role: user.role, nom: user.nom }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, nom: user.nom }); 
  } catch (err) {
    console.error("Erreur de connexion :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
