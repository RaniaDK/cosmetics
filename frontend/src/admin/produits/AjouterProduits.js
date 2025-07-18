import { useEffect, useState } from "react";
import "../css/ModifierProduits.css"; 

function AjouterProduits({ onClose }) {
  const [produit, setProduit] = useState({ nom: "", description: "", prix: "", stock: "", categorie_id: "",});
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [Preview, setPreview] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur chargement catégories:", err));
  }, []);
  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "categorie_id") {
      value = parseInt(value, 10) || "";
    }
    setProduit({
      ...produit,
      [e.target.name]: value,
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setPopupMessage("L'image est obligatoire.");
      setPopupVisible(true);
      return;
    }
    const formData = new FormData();
    for (const key in produit) {
      formData.append(key, produit[key]);
    }
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/produits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
          if (!res.ok) {
      const data = await res.json();
      setPopupMessage(`Erreur lors de l'ajout du produit : ${data.message || "Erreur inconnue"}`);
      setPopupVisible(true);
      return;
    }
      if (res.ok) {
        setPopupMessage("✅ Produit ajouté avec succès !");
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          if (onClose) onClose();
        }, 1500);
      } else {
        setPopupMessage("❌ Erreur lors de l'ajout du produit.");
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
        <h3>Ajouter un produit</h3>
        <form className="modifier-form" onSubmit={handleSubmit}>
          <input type="text"  name="nom"  value={produit.nom}  onChange={handleChange}  placeholder="Nom"  required/>
          <textarea name="description" value={produit.description} onChange={handleChange} placeholder="Description" required/>
          <input type="number" name="prix" value={produit.prix} onChange={handleChange} placeholder="Prix" required min="0" step="0.01"/>
          <input type="number" name="stock" value={produit.stock} onChange={handleChange} placeholder="Stock" required min="0" step="1"/>
          <select name="categorie_id" value={produit.categorie_id} onChange={(e) => handleChange({target: { name: "categorie_id", value: parseInt(e.target.value) || "" }})} required>
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}> {cat.nom}</option>
            ))}
          </select>
          <label>Image :</label>
          {/* {preview && (
            <img src={preview} alt="Preview" />
          )} */}
          <input type="file" name="image" onChange={handleFileChange} accept="image/*" required/>
          <div className="modifier-buttons">
            <button type="submit" className="btn-cancel"> Ajouter</button>
            <button type="button" className="btn-cancel" onClick={onClose}> Annuler</button>
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

export default AjouterProduits;
