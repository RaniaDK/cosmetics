import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import Accueil from "./index/Accueil";
import Connexion from "./compte/Connexion";
import Inscription from "./compte/Inscription";
import NouveauxProduits from "./index/NouveauxProduits";
import Produits from "./admin/produits/Produits";
import ModifierProduits from './admin/produits/ModifierProduits';
import AjouterProduits from './admin/produits/AjouterProduits';
import Categories from "./admin/categories/Categories";
import AjouterCategorie from './admin/categories/AjouterCategorie';
import ModifierCategories from './admin/categories/ModifierCategories';
import Admin from "./admin/Admin";
import APropos from "./index/APropos";
import Panier from "./panier/Panier";
import CartProvider from "./panier/CartContext";
import Commandes from "./panier/Commandes";
import Commande from "./admin/commandes/Commande";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = [
    "/Admin",
    "/Produits",
    "/modifier-produit",
    "/ajouter-produit",
    "/ajouter-categorie",
    "/Commande", //mte3 l'admin 
    "/Categories",
    "/Commandes" ,
    
    
    
  ];
  const shouldHideHeader = hideHeaderPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!shouldHideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/Connexion" element={<Connexion />} />
        <Route path="/Inscription" element={<Inscription />} />
        <Route path="/NouveauxProduits" element={<NouveauxProduits />} />
        <Route path="/Produits" element={<Produits />} />
        <Route path="/modifier-produit/:id" element={<ModifierProduits />} />
        <Route path="/ajouter-produit/:id" element={<AjouterProduits />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/ajouter-categorie" element={<AjouterCategorie />} />
        <Route path="/modifier-categorie" element={<ModifierCategories />} />
        <Route path="/Commande" element={<Commande />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/APropos" element={<APropos />} />
        <Route path="/Panier" element={<Panier />} />
        <Route path="/CartProvider" element={<CartProvider />} />
        <Route path="/Commandes" element={<Commandes />} />
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
