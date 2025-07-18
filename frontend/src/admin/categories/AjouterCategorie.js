import { useState } from "react";
import "../css/ModifierProduits.css";

function AjouterCategorie({ onClose, onCategorieAjoute }) {
  const [categorie, setCategorie] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nom", categorie);

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setPopupMessage("Catégorie ajoutée avec succès !");
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          if (onClose) onClose();
          if (onCategorieAjoute) onCategorieAjoute(categorie);
        }, 2000);

      } else {
        const data = await res.json().catch(() => ({}));
        setPopupMessage(`Erreur lors de l'ajout : ${data.message || "Erreur serveur"}`);
        setPopupVisible(true);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setPopupMessage("Erreur réseau.");
      setPopupVisible(true);
    }
  };

  return (
    <div className="overlay">
      <div className="popup-box">
        <h3>Ajouter une catégorie</h3>
        <form className="modifier-form" onSubmit={handleSubmit}>
          <input type="text" value={categorie} onChange={(e) => setCategorie(e.target.value)} placeholder="Nom de la catégorie" required/>
          <div className="modifier-buttons">
            <button type="submit" className="btn-cancel">  Ajouter </button>
            <button type="button" className="btn-cancel" onClick={onClose}> Annuler</button>
          </div>
        </form>

        {popupVisible && (
          <div className="overlay">
            <div className="popup-box">
              <p>{popupMessage}</p>
              <div className="popup-actions">
                <button className="btn btn-cancel" onClick={() => setPopupVisible(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AjouterCategorie;
