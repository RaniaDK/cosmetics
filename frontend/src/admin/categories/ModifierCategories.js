import { useState, useEffect } from "react";
import "../css/ModifierProduits.css"; 

function ModifierCategories({ id, onClose }) {
  const [categorie, setCategorie] = useState({ nom: "" });
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  useEffect(() => {
    fetch(`http://localhost:5000/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) => setCategorie({ nom: data.nom }))
      .catch((err) => console.error("Erreur fetch catégorie :", err));
  }, [id]);
  const handleChange = (e) => {
    setCategorie({ ...categorie, nom: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("nom", categorie.nom);
        const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`, 
        },
        body: formData,
        });
        if (res.ok) {
        setPopupMessage("Catégorie modifiée avec succès !");
        setPopupVisible(true);
        setTimeout(() => {
            setPopupVisible(false);
            onClose && onClose();
        }, 2000);
        } else {
        setPopupMessage("Erreur lors de la modification.");
        setPopupVisible(true);
        }
    } catch (err) {
        console.error("Erreur réseau :", err);
        setPopupMessage("Erreur réseau.");
        setPopupVisible(true);
    }
    };
  return (
    <div className="modifier-container">
      <h2>Modifier la catégorie</h2>
      <form className="modifier-form" onSubmit={handleSubmit}>
        <input type="text" name="nom" value={categorie.nom} onChange={handleChange} placeholder="Nom de la catégorie" required/>
        <div className="modifier-buttons">
          <button type="submit" className="btn-cancel">  Enregistrer</button>
          <button type="button" className="btn-cancel" onClick={onClose}>  Annuler</button>
        </div>
      </form>

      {popupVisible && (
        <div className="popup-message">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ModifierCategories;