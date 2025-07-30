import { useState } from "react";
import "./Commandes.css";

function Commandes({ panier, total, utilisateurId, onClose, onCommandeSuccess }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [modePaiement, setModePaiement] = useState("livraison"); 

  const handleConfirmer = async () => {
  if (!nomClient || !adresse || !telephone) {
    setPopupMessage("❗ Veuillez remplir tous les champs.");
    setPopupVisible(true);
    return;
  }

  try {
    const produits = panier.map((item) => ({
      id_produit: item.id_produit,
      quantite: item.quantite,
    }));
    if (modePaiement === "livraison") {
      const res = await fetch("http://localhost:5000/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_utilisateur: utilisateurId,
          client: { nom: nomClient, adresse, telephone },
          produits,
          paiement: "livraison",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur inconnue");

      setPopupMessage("✅ Commande passée avec succès !");
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
        if (onCommandeSuccess) onCommandeSuccess();
        if (onClose) onClose();
      }, 1500);
    } 
    

    else {
      const res = await fetch("http://localhost:5000/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panier,
          id_utilisateur: utilisateurId,
          client: { nom: nomClient, adresse, telephone },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur inconnue");

      // Redirige vers Stripe
      window.location.href = data.url;
    }
  } catch (err) {
    console.error("❌ Erreur :", err);
    setPopupMessage("❌ " + err.message);
    setPopupVisible(true);
  }
};


  // const handleConfirmer = async () => {
  //   if (!nomClient || !adresse || !telephone) {
  //     setPopupMessage("❗ Veuillez remplir tous les champs.");
  //     setPopupVisible(true);
  //     return;
  //   }
  //   try {
  //     const produits = panier.map((item) => ({
  //     id_produit: item.id_produit,
  //     quantite: item.quantite,
  //   }));

  //       const res = await fetch("http://localhost:5000/api/commandes", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //           id_utilisateur: utilisateurId,
  //           client: {
  //           nom: nomClient,
  //           adresse: adresse,
  //           telephone: telephone,
  //           },
  //           produits,
  //       }),
  //       });

  //     const data = await res.json();
  //     if (!res.ok) {
  //       setPopupMessage(`❌ Erreur lors de la commande : ${data.message || "Erreur inconnue"}`);
  //       setPopupVisible(true);
  //       return;
  //     }
  //     setPopupMessage("✅ Commande passée avec succès !");
  //     setPopupVisible(true);
  //     setTimeout(() => {
  //       setPopupVisible(false);
  //       if (onCommandeSuccess) onCommandeSuccess(); 
  //       if (onClose) onClose(); 
  //     }, 1500);
  //   } catch (err) {
  //     console.error("❌ Erreur réseau :", err);
  //     setPopupMessage("❌ Erreur réseau lors de la commande.");
  //     setPopupVisible(true);
  //   }
  // };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h5>Confirmation de commande</h5>
        {/* <p>Remplissez vos informations pour finaliser la commande :</p> */}
        <div className="form-client">
          <input type="text" placeholder="Votre nom complet" value={nomClient} onChange={(e) => setNomClient(e.target.value)} required/>
          <input type="text" placeholder="Adresse de livraison" value={adresse} onChange={(e) => setAdresse(e.target.value)} required/>
          <input type="tel"  placeholder="Numéro de téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} maxLength="8" minLength="8" required/>
        </div>
        <div className="form-client">
          <select value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
            <option value="livraison">💵 Paiement à la livraison</option>
            <option value="enligne">💳 Paiement par carte</option>
          </select>
        </div>

        {/* <h4>Produits :</h4>
        <ul className="liste-produits">
          {panier.map((item, index) => (
            <li key={index}>
              {item.nom} × {item.quantite} — {(item.prix * item.quantite).toFixed(2)} TND
            </li>
          ))}
        </ul> */}
        <p className="popup-total"> Total : <strong>{total.toFixed(2)} TND</strong></p>
        <div className="popup-actions">
          <button className="btn-confirmer" onClick={handleConfirmer}>✅ Confirmer</button>
          <button className="btn-annuler" onClick={onClose}>❌ Annuler</button>
        </div>
        {popupVisible && (
        <div className="overlay" id="popupMessage">
          <div className="popup-box">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupVisible(false)} className="btn-fermer">Fermer</button>
          </div>
        </div>)}
      </div>
    </div>
  );
}

export default Commandes;
