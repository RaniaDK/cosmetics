import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Produits.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTachometerAlt,faChartBar,faShoppingCart,faSignOutAlt,faBars,faEdit,faTrash,faBox} from "@fortawesome/free-solid-svg-icons";
import ModifierProduits from "./ModifierProduits";
import AjouterProduits from "./AjouterProduits";


function Produits() {
  const [produits, setProduits] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminNom, setAdminNom] = useState("");
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [produitASupprimer, setProduitASupprimer] = useState(null);
  const [modifierPopupVisible, setModifierPopupVisible] = useState(false);
  const [produitAModifierId, setProduitAModifierId] = useState(null);
  const [ajouterProduitVisible, setAjouterProduitVisible] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/Connexion");
      return;
    }
    setAdminNom(localStorage.getItem("admin_nom") || "Admin");
    fetch("http://localhost:5000/api/produits", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProduits(data))
      .catch((err) => console.error("Erreur chargement produits:", err));
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_nom");
    localStorage.removeItem("role");
    navigate("/Accueil");
  };
  const confirmerSuppression = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/api/produits/${produitASupprimer}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setProduits(produits.filter((p) => p.id !== produitASupprimer));
      setPopupMessage("Produit supprimé avec succès !");
      setPopupVisible(!popupVisible)
    } else {
      setPopupMessage("Erreur lors de la suppression.");
    }
  } catch (err) {
    console.error("Erreur suppression:", err);
    setPopupMessage("Erreur réseau lors de la suppression.");
  } finally {
    setProduitASupprimer(null);
  }
};


  return (
    <div className="container">
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <span>R</span>ania <span>B</span>eauty
          </h2>
        </div>
        <nav className="sidebar-nav">
          <a href="/Admin" className="nav-item">
            <FontAwesomeIcon icon={faTachometerAlt} /> <span>Dashboard</span>
          </a>
          <a href="/Produits" className="nav-item active">
            <FontAwesomeIcon icon={faChartBar} /> <span>Produits</span>
          </a>
          <a href="/Categories" className="nav-item">
            <FontAwesomeIcon icon={faBox} /> <span>Catégorie</span>
          </a>
          <a href="/commande" className="nav-item">
            <FontAwesomeIcon icon={faShoppingCart} /> <span>Commandes</span>
          </a>
          <button onClick={handleLogout} className="nav-item">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="brand">
            <span>R</span>ania <span>B</span>eauty
          </div>
          <div className="user-profile">
            <span>Bienvenue {adminNom}.</span>
            <img src="" alt="User Avatar" className="avatar" />
          </div>
        </header>
        <div className="form-container">
          <h2>Liste des Produits</h2>
          <div className="actions-buttons">
          <button className="btn-add" onClick={() => setAjouterProduitVisible(true)}>Ajouter un produit</button>

        </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.nom}</td>
                  <td>{prod.prix} dt</td>
                  <td>{prod.stock}</td>
                  <td>{prod.categorie_nom ||"Sans catégorie" }</td>
                  <td>
                    <button className="btn-delete"
                    onClick={() => {
                        setProduitAModifierId(prod.id);
                        setModifierPopupVisible(true);        
                    }}
                    title={`Modifier le produit "${prod.nom}"`}>
                    <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn-delete" onClick={() => {
                            setProduitASupprimer(prod.id);
                            setPopupMessage(`Voulez-vous vraiment supprimer le produit "${prod.nom}" ?`);
                            setPopupVisible(true);
                        }}
                        ><FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {popupVisible && (
        <div className="overlay" id="popupMessage">
            <div className="popup-box">
            <p>{popupMessage}</p>
            <div className="popup-actions">
                <button className="btn btn-delete" onClick={confirmerSuppression}>Oui, supprimer</button>
                <button className="btn btn-cancel" onClick={() => setPopupVisible(false)}>Annuler</button>
            </div>
            </div>
        </div>
        )}
        {modifierPopupVisible && produitAModifierId && (
        <div className="overlay">
            <div className="popup-box">
            <ModifierProduits
                id={produitAModifierId}
                onClose={() => {
                setModifierPopupVisible(false);
                setProduitAModifierId(null);
                fetch("http://localhost:5000/api/produits", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })
                    .then((res) => res.json())
                    .then((data) => setProduits(data))
                    .catch((err) => console.error("Erreur chargement produits:", err));
                }} />
            </div>
        </div>
        )}
        {ajouterProduitVisible && (
        <div className="overlay">
          <div className="popup-box">
            <AjouterProduits 
              onClose={() => {
                setAjouterProduitVisible(false);
                fetch("http://localhost:5000/api/produits", {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })
                  .then(res => res.json())
                  .then(data => setProduits(data))
                  .catch(err => console.error(err));
              }}
            />
          </div>
        </div>
      )}
      {/* {ajouterCategorieVisible && (
        <AjouterCategorie
          onClose={() => setAjouterCategorieVisible(false)}
          onCategorieAjoute={(nouvelleCategorie) => {
            alert(`Catégorie "${nouvelleCategorie}" ajoutée !`);
          }}
        />
      )} */}
      </main>
    </div>
  );
}

export default Produits;
