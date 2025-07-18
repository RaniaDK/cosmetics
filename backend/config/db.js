const { Client} = require('pg');
require('dotenv').config();
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"cosmetics",
    database:"cosmetics" 
})
client.connect()
  .then(() => console.log("✅ Connexion réussie à PostgreSQL"))
  .catch(err => console.error("❌ Erreur de connexion :", err));

module.exports = client;

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