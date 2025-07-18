import { useEffect, useState } from "react";
import "./NouveauxProduits.css";

function NouveauxProduits() {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/produits")
      .then((res) => res.json())
      .then((data) => setProduits(data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, []);

  const produitsParCategorie = produits.reduce((acc, produit) => {
    if (!acc[produit.categorie_nom]) {
      acc[produit.categorie_nom] = [];
    }
    acc[produit.categorie_nom].push(produit);
    return acc;
  }, {});

  const ajouterAuPanier = async (produit) => {
    try {
      const res = await fetch("http://localhost:5000/api/panier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_produit: produit.id,
          quantite: 1,
        }),
      });

      if (res.ok) {
        alert(`${produit.nom} ajouté au panier ✅`);
      } else {
        alert("Erreur lors de l'ajout au panier ❌");
      }
    } catch (err) {
      console.error("Erreur panier :", err);
      alert("Erreur réseau ❌");
    }
  };

  return (
    <section className="nouveaux-section-custom">
      <h2 className="section-title">✨ Produits par catégorie</h2>

      {Object.entries(produitsParCategorie).map(([categorie_nom, produits]) => (
        <div key={categorie_nom} id={categorie_nom.toLowerCase()} className="categorie-section">
          <h2 className="categorie-titre">🧴 {categorie_nom}</h2>

          <div className="categories">
            {produits.map((produit) => (
              <div className="category-box" key={produit.id}>
                <h4>{produit.nom}</h4>
                {produit.image_url && (
                  <img
                    src={`http://localhost:5000/images/${produit.image_url}`}
                    alt={produit.nom}
                    className="product-image"
                  />
                )}
                <h4>{produit.description}</h4>
                <p><strong>{produit.prix} TND</strong></p>
                <button className="btn-panier" onClick={() => ajouterAuPanier(produit)}>  Ajouter au panier 🛍️</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default NouveauxProduits;
