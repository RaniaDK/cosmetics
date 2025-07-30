const bcrypt = require("bcrypt");
const pool = require("./db"); 

async function insererAdmin() {
  try {
    const motDePasseClair = "raniaa"; // 🔐 Mot de passe admin (choisis ce que tu veux)
    const motDePasseHashe = await bcrypt.hash(motDePasseClair, 10);

    await pool.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES ($1, $2, $3, $4)",
      ["rania", "rania1@gmail.com", motDePasseHashe, "client"]
    );

   } catch (err) {
    console.error("❌ Erreur insertion client :", err);
  } finally {
    pool.end();
  }
}
insererAdmin();
