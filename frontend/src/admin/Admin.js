import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTachometerAlt,faChartBar,faUsers,faShoppingCart,faSignOutAlt,faBars,faBox,} from "@fortawesome/free-solid-svg-icons";

function Admin() {
  const [nbClients, setNbClients] = useState(0);
  const [nbProduits, setNbProduits] = useState(0);
  const [NbCategories, setNbCategories] = useState(0);
  const [nbCommandes, setNbCommandes] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminNom, setAdminNom] = useState("");
  const navigate = useNavigate();
console.log("admin page")
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/Connexion");
      return;
    }

    setAdminNom(localStorage.getItem("admin_nom") || "Admin");

    fetch("http://localhost:5000/api/statistiques", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNbClients(data.nb_clients);
        setNbProduits(data.nb_produits);
        setNbCategories(data.nb_categories);
        setNbCommandes(data.nb_commandes);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des statistiques", err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_nom");
    localStorage.removeItem("role");
    navigate("/Accueil");
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
          <button className="nav-item active">
            <FontAwesomeIcon icon={faTachometerAlt} /> <span>Dashboard</span>
          </button>
          <a href="/Produits" className="nav-item">
            <FontAwesomeIcon icon={faChartBar} /> <span>Produits</span>
          </a>
          <a href="/Categories" className="nav-item">
            <FontAwesomeIcon icon={faUsers} /> <span>Catégorie</span>
          </a>
          <a href="/Commandes" className="nav-item">
            <FontAwesomeIcon icon={faShoppingCart} /> <span>Commandes</span>
          </a>
          <button onClick={handleLogout} className="nav-item">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <header className="top-bar">
          <button className="menu-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
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

        <section className="dashboard-content">
          <div className="stats-cards">
            <div className="card">
              <h3>Clients</h3>
              <p className="value">{nbClients}</p>
              <FontAwesomeIcon icon={faUsers} className="card-icon" />
            </div>
            <div className="card">
              <h3>Produits</h3>
              <p className="value">{nbProduits}</p>
              <FontAwesomeIcon icon={faBox} className="card-icon" />
            </div>
            <div className="card">
              <h3>Categories</h3>
              <p className="value">{NbCategories}</p>
              <FontAwesomeIcon icon={faBox} className="card-icon" />
            </div>
          </div>

          <div className="stats-cards">
            <div className="card full-width">
              <h3>Commandes</h3>
              <p className="value">{nbCommandes}</p>
              <FontAwesomeIcon icon={faShoppingCart} className="card-icon" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
