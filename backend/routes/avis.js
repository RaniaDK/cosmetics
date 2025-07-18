const express = require('express');
const router = express.Router();
const db = require('../db');

// POST ajouter un avis
/*router.post('/', async (req, res) => {
  const { id_utilisateur, id_produit, note, commentaire } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO avis (id_utilisateur, id_produit, note, commentaire) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_utilisateur, id_produit, note, commentaire]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur ajout avis :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});*/


router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM avis');
    console.log("result",result)
    res.json(result.rows); 
  } catch (err) {
    console.error('Erreur de récupération des avis', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
