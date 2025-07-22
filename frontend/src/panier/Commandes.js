import { useState } from "react";
import "./Commandes.css";

function Commandes({ panier, total, utilisateurId, onClose, onCommandeSuccess }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Champs client
  const [nomClient, setNomClient] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");

  const handleConfirmer = async () => {
    if (!nomClient || !adresse || !telephone) {
      setPopupMessage("❗ Veuillez remplir tous les champs.");
      setPopupVisible(true);
      return;
    }

    try {
        console.log("Contenu du panier :", panier);

      const produits = panier.map((item) => ({
      id_produit: item.id_produit,
      quantite: item.quantite,
    }));

        const res = await fetch("http://localhost:5000/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_utilisateur: utilisateurId,
            client: {
            nom: nomClient,
            adresse: adresse,
            telephone: telephone,
            },
            produits,
        }),
        });


      const data = await res.json();
      console.log(JSON.stringify(data))

      if (!res.ok) {
        setPopupMessage(`❌ Erreur lors de la commande : ${data.message || "Erreur inconnue"}`);
        setPopupVisible(true);
        return;
      }

      setPopupMessage("✅ Commande passée avec succès !");
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
        if (onCommandeSuccess) onCommandeSuccess(); // vider le panier
        if (onClose) onClose(); // fermer la popup
      }, 1500);
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      setPopupMessage("❌ Erreur réseau lors de la commande.");
      setPopupVisible(true);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Confirmation de commande</h3>

        <p>Remplissez vos informations pour finaliser la commande :</p>

        <div className="form-client">
          <input
            type="text"
            placeholder="Votre nom complet"
            value={nomClient}
            onChange={(e) => setNomClient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Adresse de livraison"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
          <input
            type="tel" 
            placeholder="Numéro de téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>

        <h4>Produits :</h4>
        <ul className="liste-produits">
          {panier.map((item, index) => (
            <li key={index}>
              {item.nom} × {item.quantite} — {(item.prix * item.quantite).toFixed(2)} TND
            </li>
          ))}
        </ul>

        <p className="popup-total">
          Total : <strong>{total.toFixed(2)} TND</strong>
        </p>

        <div className="popup-actions">
          <button className="btn-confirmer" onClick={handleConfirmer}>✅ Confirmer</button>
          <button className="btn-annuler" onClick={onClose}>❌ Annuler</button>
        </div>
        
      {popupVisible && (
        <div className="popup-message">
          <p>{popupMessage}</p>
        </div>
      )}
      </div>

    </div>
  );
}

export default Commandes;
