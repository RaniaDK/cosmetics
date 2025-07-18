import { useState } from "react";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "./Connexion.css";

function Connexion() {
  console.log("login")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Erreur de connexion");
        return;
      }
      const decodeToken = jwtDecode(data.token);
      const role = decodeToken.role;
      const nom = data.nom || decodeToken.nom; // sécuriser avec fallback

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("nom", nom);

      if (role === "admin") {
        window.location.href = "/Admin";
      } else {
        window.location.href = "/Accueil";
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setPopupMessage("Erreur serveur ou réseau.");
      setPopupVisible(true);
    }
  };


  return (
    <div className="center-container">
      <section className="box-container">
        <h2 className="form-title">Se connecter</h2>
        <form className="formulaire" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-inscription"> Se connecter</button>
          <p className="register-link">
            Pas encore inscrit ? <Link to="/Inscription">Créer un compte</Link>
          </p>
        </form>
      </section>
      
      {/* Popup dynamique */}
      {popupVisible && (
        <div className="overlay" id="popupMessage">
          <div className="popup-box">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupVisible(false)} className="btn-fermer">Fermer</button>
          </div>
        </div>)}
    </div>
  );
}

export default Connexion;
