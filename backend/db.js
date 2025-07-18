const { Pool} = require('pg');
require('dotenv').config();
const pool = new Pool({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"cosmetics",
    database:"cosmetics" 
})
pool.connect()
  .then(() => console.log("✅ Connexion réussie à PostgreSQL"))
  .catch(err => console.error("❌ Erreur de connexion :", err));

module.exports = pool;

/*client.query('SELECT * FROM utilisateurs')
  .then(res => {
    console.log("✅ Données :", res.rows);
  })
  .catch(err => console.error("❌ Erreur SELECT :", err));


client.query('SELECT * FROM produits')
.then(res => {
    console.log("✅ Données :", res.rows);
})
.catch(err => console.error("❌ Erreur SELECT :", err));

client.query('SELECT * FROM avis')
  .then(res => {
    console.log("✅ Données :", res.rows);
  })
  .catch(err => console.error("❌ Erreur SELECT :", err));*/