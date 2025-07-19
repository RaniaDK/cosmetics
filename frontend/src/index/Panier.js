import React, { useState, useEffect } from "react";
import "./Panier.css";

function Panier() {
  const id_utilisateur = localStorage.getItem("utilisateur_id");
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        if (!id_utilisateur) return;
        const res = await fetch(`http://localhost:5000/api/panier/utilisateur/${id_utilisateur}`);
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setPanier(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    };
    fetchPanier();
  }, [id_utilisateur]);

  const supprimerProduit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/panier/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression");
      setPanier((prevPanier) => prevPanier.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  // Calcul du total panier
  const total = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);
  if (!id_utilisateur) {
    return <p className="panier-vide">Veuillez vous connecter pour voir votre compte.</p>;
  }
  if (panier.length === 0) {
    return <p className="panier-vide">Votre panier est vide.</p>;
  }
  return (
    <div className="panier-container">
      <h2 className="panier-title">Votre Panier</h2>
      <table className="panier-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Sous-total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {panier.map(({ id, nom, prix, quantite }) => (
            <tr key={id}>
              <td>{nom}</td>
              <td>{parseFloat(prix).toFixed(2)} TND</td>
              <td>{quantite}</td>
              <td>{(parseFloat(prix) * quantite).toFixed(2)} TND</td>
              <td>
                <button className="btn-supprimer" onClick={() => supprimerProduit(id)}> Supprimer </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="total-panier">Total : {total.toFixed(2)} TND </h3>
      <div className="btn-container">
        <button className="btn-commander"  onClick={() => alert("Fonction de commande à implémenter")} >  Passer à la commande </button>
      </div>
    </div>
  );
}

export default Panier;
