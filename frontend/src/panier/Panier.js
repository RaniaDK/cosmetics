import React, { useState, useEffect } from "react";
import "./Panier.css";
import Commandes from "./Commandes";

function Panier() {
  const id_utilisateur = localStorage.getItem("utilisateur_id");
  const [panier, setPanier] = useState([]);
  const [confirmerCommandeVisible, setConfirmerCommandeVisible] = useState(false);

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

  const supprimerProduit = async (id_produit) => {
    try {
      const res = await fetch(`http://localhost:5000/api/panier/${id_utilisateur}/${id_produit}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur suppression");

      setPanier((prevPanier) => prevPanier.filter((item) => item.id_produit !== id_produit));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  const total = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  return (
    <div className="panier-container">
      <h2 className="panier-title">Mon Panier</h2>
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
          {!id_utilisateur ? (
            <tr>
              <td colSpan="5" className="panier-vide">Veuillez vous connecter pour voir votre panier.</td>
            </tr>
          ) : panier.length === 0 ? (
            <tr>
              <td colSpan="5" className="panier-vide">Votre panier est vide.</td>
            </tr>
          ) : (
            panier.map(({ id_produit, nom, prix, quantite }) => (
              <tr key={id_produit}>
                <td>{nom}</td>
                <td>{parseFloat(prix).toFixed(2)} TND</td>
                <td>{quantite}</td>
                <td>{(parseFloat(prix) * quantite).toFixed(2)} TND</td>
                <td>
                  <button className="btn-supprimer" onClick={() => supprimerProduit(id_produit)}>Supprimer</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {id_utilisateur && panier.length > 0 && (
        <>
          <h3 className="total-panier">Total : {total.toFixed(2)} TND</h3>
          <div className="btn-container">
            <button className="btn-commander" onClick={() => setConfirmerCommandeVisible(true)}>  Passer à la commande</button>
          </div>
        </>
      )}

      {confirmerCommandeVisible && (
        <div className="overlay">
          <div className="popup-box">
            <Commandes
              panier={panier}
              total={total}
              utilisateurId={id_utilisateur}
              onClose={() => setConfirmerCommandeVisible(false)}
             onCommandeSuccess={async () => {
              try {
                await fetch(`http://localhost:5000/api/panier/utilisateur/${id_utilisateur}`, {
                  method: 'DELETE',
                });
                setPanier([]); 
              } catch (err) {
                console.error('Erreur lors du vidage du panier après commande', err);
              }
            }}/>
          </div>
        </div>
      )}
    </div>
  );
}
export default Panier;
