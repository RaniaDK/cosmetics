import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Produits.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt,faChartBar,faUsers,faShoppingCart,faSignOutAlt,faBars,faEdit,faTrash,} from "@fortawesome/free-solid-svg-icons";
import AjouterCategorie from "./AjouterCategorie";
import ModifierCategories from "./ModifierCategories";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminNom, setAdminNom] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [categorieASupprimer, setCategorieASupprimer] = useState(null);
  const [ajouterCategorieVisible, setAjouterCategorieVisible] = useState(false);
  const [categorieAModifierId, setCategorieAModifierId] = useState(null);
  const [modifierCategorieVisible, setModifierCategorieVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/Connexion");
      return;
    }
    setAdminNom(localStorage.getItem("admin_nom") || "Admin");
    fetchCategories();
  }, [navigate]);
  const fetchCategories = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur chargement catégories:", err));
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_nom");
    localStorage.removeItem("role");
    navigate("/Accueil");
  };
  const confirmerSuppression = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/categories/${categorieASupprimer}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== categorieASupprimer));
        setPopupMessage("Catégorie supprimée avec succès !");
        setPopupVisible(!popupVisible)
      } else {
        setPopupMessage("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
      setPopupMessage("Erreur réseau lors de la suppression.");
    } finally {
      setCategorieASupprimer(null);
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
          <a href="/Produits" className="nav-item">
            <FontAwesomeIcon icon={faChartBar} /> <span>Produits</span>
          </a>
          <a href="/Categories" className="nav-item active">
            <FontAwesomeIcon icon={faUsers} /> <span>Catégories</span>
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
          <h2>Liste des Catégories</h2>
          <div className="actions-buttons">
            <button className="btn-add" onClick={() => setAjouterCategorieVisible(true)} >   Ajouter une catégorie </button>
          </div>
          <table className="product-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.nom}</td>
                  <td>
                    <button className="btn-delete" onClick={() => {
                        setCategorieAModifierId(cat.id);
                        setModifierCategorieVisible(true);  }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        setCategorieASupprimer(cat.id);
                        setPopupMessage(`Voulez-vous vraiment supprimer la catégorie "${cat.nom}" ?` );
                        setPopupVisible(true); }}>
                      <FontAwesomeIcon icon={faTrash} />
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
                <button className="btn btn-delete" onClick={confirmerSuppression}>  Oui, supprimer</button>
                <button className="btn btn-cancel" onClick={() => setPopupVisible(false)}> Annuler</button>
              </div>
            </div>
          </div>
        )}
        {ajouterCategorieVisible && (
            <AjouterCategorie
            onClose={() => setAjouterCategorieVisible(false)}
            onCategorieAjoute={(nouvelleCategorie) => {
            }}
            />
        )}
        {modifierCategorieVisible && categorieAModifierId && (
          <div className="overlay">
            <div className="popup-box">
              <ModifierCategories
                id={categorieAModifierId} onClose={() => {
                  setModifierCategorieVisible(false);
                  setCategorieAModifierId(null);
                  fetchCategories(); }}/>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Categories;
