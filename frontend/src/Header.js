import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";

function Header() {
  const [nom, setNom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nomUtilisateur = localStorage.getItem("nom");
    if (token && nomUtilisateur) {
      setNom(nomUtilisateur);
    } else {
      setNom(null);
    }
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nom");
    localStorage.removeItem("utilisateur_id");
    setNom(null);
    navigate("/Accueil");
  };

  return (
    <header className="header">
      <h1 className="logo">
        <span>Rania</span>Beauty
      </h1>
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/Accueil">Accueil</Link></li>
          <li><ScrollLink to="contact" smooth={true} duration={500}>Contact</ScrollLink></li>
          <li><Link to="/Panier">Panier</Link></li>
          <li><Link to="/APropos"> À propres</Link></li>
          {nom ? (
            <>
              <li className="nom-client" aria-label={`Bienvenue ${nom}`}> Bienvenue <strong>{nom}</strong>
              </li>
              <li>
                <button  onClick={handleLogout}  className="btn-logout"  aria-label="Déconnexion">  Déconnexion</button>
              </li>
            </>
          ) : (
            <li><Link to="/Connexion">Connexion</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
