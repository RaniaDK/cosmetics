import "./Accueil.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NouveauxProduits from "./NouveauxProduits";
import AvisClients from "./Avis";

function Accueil() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categorie, setCategorie] = useState("");
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur chargement catégories:", err));
  }, []);

  function BarreRecherche() {
    return (
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control my-3 barre-recherche"
      />
    );
  }

  function Filtres() {
    return (
      <div className="filtres">
        <select
          value={categorie}
          onChange={(e) => {
            const selected = e.target.value;
            setCategorie(selected);
            if (selected) {
              const section = document.getElementById(selected.toLowerCase());
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }
          }}>
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.nom}>
              {cat.nom}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      {/* <div className="recherche-filtre-section">
        <BarreRecherche />
        <Filtres />
      </div> */}

      <section className="accueil-box">
        <div className="box">
          <div className="accueil-titre">
            <h1>
              Bienvenue sur <span>Rania Beauty</span> !
            </h1>
            <p className="slogan">✨ La beauté commence avec vous ✨</p>
            <p className="accueil-texte">
              Découvrez une collection unique de produits cosmétiques naturels, élégants et faits pour vous sublimer. 🌸
            </p>
            <div className="accueil-buttons">
              <Link to="/Connexion" className="btn-principal">
                Se connecter
              </Link>
              <Link to="/NouveauxProduits" className="btn-secondaire">
                Voir la boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NouveauxProduits searchTerm={searchTerm} />
      <AvisClients />

      <section id="contact" className="contact-section">
        <h2 className="contact-title">📞 Contactez-nous</h2>
        <p className="contact-text">
          Pour toute question ou assistance, n’hésitez pas à nous écrire ou nous appeler :
        </p>
        <div className="contact-info">
          <p>
            <strong>Email :</strong>{" "}
            <a href="mailto:contact@raniabeauty.tn">contact@raniabeauty.tn</a>
          </p>
          <p>
            <strong>Téléphone :</strong>{" "}
            <a href="tel:+21612345678">+216 12 345 678</a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Accueil;
