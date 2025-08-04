const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const path = require("path");


app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));

const produitsRoutes = require('./routes/produits');
app.use('/api/produits', produitsRoutes);

const panierRoutes = require('./routes/panier');
app.use('/api/panier', panierRoutes);

const avisRoutes = require('./routes/avis');
app.use('/api/avis', avisRoutes);

const loginRoutes = require('./routes/login');
app.use('/api/login', loginRoutes);

const utilisateursRoutes = require("./routes/utilisateurs");
app.use("/api/utilisateurs", utilisateursRoutes);

const categoriesRouter = require("./routes/categories");
app.use("/api/categories", categoriesRouter);


const statistiquesRoutes = require("./routes/statistiques");
app.use("/api/statistiques", statistiquesRoutes);


const commandesRoutes = require('./routes/commandes');
app.use('/api/commandes', commandesRoutes);

