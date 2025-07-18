import { useState, useEffect } from "react";
import"../css/ModifierProduits.css";


function ModifierProduits({ id, onClose }) {


  const [produit, setProduit] = useState({nom: "",description: "",prix: "",stock: "",categorie_id: "",image_url:""});
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); 
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/produits/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduit({
          ...data,
          categorie_id: data.categorie_id || "",
        });
        setPreview(null);
      })
      .catch((err) => console.error("Erreur fetch produit :", err));


    fetch(`http://localhost:5000/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur fetch catégories :", err));
  }, [id]);

  const handleChange = (e) => {
    setProduit({
      ...produit,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      // crée URL temporaire pour prévisualisation
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const formData = new FormData();
      for (const key in produit) {
        formData.append(key, produit[key]);
      }
      if (image) {
        formData.append("image", image);
      }
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/produits/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setPopupMessage("Produit modifié avec succès !");
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          if (onClose) onClose();
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
      <h2>Modifier le produit</h2>
      <form className="modifier-form" onSubmit={handleSubmit}>
        <input type="text" name="nom" value={produit.nom} onChange={handleChange} placeholder="Nom" required /><br/>
        <input type="text" name="description" value={produit.description} onChange={handleChange} placeholder="Description" required /><br/>
        <input type="float" name="prix" step="1" min="0" value={produit.prix} onChange={handleChange} placeholder="Prix" required /><br/>
        <input type="number" name="stock" step="1" min="0" value={produit.stock} onChange={handleChange} placeholder="Stock" required /><br/>
        <select name="categorie_id" value={produit.categorie_id} onChange={handleChange} required>
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}> {cat.nom}</option>
          ))}
        </select>
        <input type="file" name="image" onChange={handleFileChange} accept="image/*" />       
        <div className="modifier-buttons">
          <button type="submit" className="btn-cancel">Enregistrer</button>
          <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
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

export default ModifierProduits;
