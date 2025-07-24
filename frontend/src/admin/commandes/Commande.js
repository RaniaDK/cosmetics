import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Produits.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faChartBar, faShoppingCart, faSignOutAlt, faBars, faTrash, faBox} from "@fortawesome/free-solid-svg-icons";

function Commande() {
  const [commandes, setCommandes] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminNom, setAdminNom] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [commandeASupprimer, setCommandeASupprimer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/Connexion");
      return;
    }

    setAdminNom(localStorage.getItem("admin_nom") || "Admin");

    fetch("http://localhost:5000/api/commandes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCommandes(data))
      .catch((err) => console.error("Erreur chargement commandes:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Accueil");
  };

  const confirmerSuppression = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/commandes/${commandeASupprimer}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setCommandes(commandes.filter((cmd) => cmd.id !== commandeASupprimer));
        setPopupMessage("Commande supprimée avec succès !");
      } else {
        setPopupMessage("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
      setPopupMessage("Erreur réseau lors de la suppression.");
    } finally {
      setCommandeASupprimer(null);
      setPopupVisible(false);
      setTimeout(() => setPopupMessage(""), 3000);
    }
  };
    // Fonction pour changer le statut d'une commande
  const handleChangerStatut = async (idCommande, nouveauStatut) => {
    const token = localStorage.getItem("token");
    try {
      // Mise à jour locale immédiate pour l'UX
      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === idCommande ? { ...cmd, statut: nouveauStatut } : cmd
        )
      );

      // Envoi de la mise à jour au backend
      const res = await fetch(`http://localhost:5000/api/commandes/${idCommande}/statut`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour du statut");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut");
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
          <a href="/Categories" className="nav-item">
            <FontAwesomeIcon icon={faBox} /> <span>Catégories</span>
          </a>
          <a href="/commande" className="nav-item active">
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
          </div>
        </header>

        <div className="form-container">
          <h2>Liste des Commandes</h2>
          <table className="product-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Adresse</th>
                <th>Téléphone</th>
                <th>Total</th>
                <th>Date</th>
                <th>Statut</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {commandes.map((cmd) => (
                <tr key={cmd.id}>
                  <td>{cmd.nom_client}</td>
                  <td>{cmd.adresse_livraison}</td>
                  <td>{cmd.telephone}</td>
                  <td>{cmd.total} dt</td>
                  <td>{new Date(cmd.date_commande).toLocaleDateString()}</td>
                  <td>
                    <select value={cmd.statut} onChange={(e) => handleChangerStatut(cmd.id, e.target.value)}>
                        <option value="en attente">En attente</option>
                        <option value="confirmée">Confirmée</option>
                        <option value="en cours de livraison">En cours de livraison</option>
                        <option value="livrée">Livrée</option>
                        <option value="annulée">Annulée</option>
                    </select>
                    </td>

                  {/* <td>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        setCommandeASupprimer(cmd.id);
                        setPopupMessage(
                          `Voulez-vous vraiment supprimer la commande du client "${cmd.nom_client}" ?`
                        );
                        setPopupVisible(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup confirmation suppression */}
        {/* {popupVisible && (
          <div className="overlay">
            <div className="popup-box">
              <p>{popupMessage}</p>
              <div className="popup-actions">
                <button className="btn btn-delete" onClick={confirmerSuppression}>
                  Oui, supprimer
                </button>
                <button className="btn btn-cancel" onClick={() => setPopupVisible(false)}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )} */}
      </main>
    </div>
  );
}

export default Commande;
