import "./Connexion.css";
import { useState } from "react";

function Inscription() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setmot_de_passe] = useState("");
  const [confirmation, setConfirmation] = useState("");
//
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !email || !mot_de_passe || !confirmation) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    if (mot_de_passe !== confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/utilisateurs/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, mot_de_passe }),
      });
      const data = await res.json();
      if (res.ok) {
        //
        setPopupMessage("✅ Inscription réussie !");
        setPopupVisible(true);
        window.location.href = "/connexion";
      } else {
        //
        setPopupMessage("❌ Erreur : " + data.message);
        setPopupVisible(true);
      }
    } catch (err) {
      //
      console.error("Erreur lors de l'inscription :", err);
      setPopupMessage("Une erreur s'est produite.");
      setPopupVisible(true);
    }
  };
  return (
    <div className="center-container">
      <section className="box-container">
        <h2 className="form-title">Créer un compte</h2>
        <form className="formulaire" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input  type="text" placeholder="Votre nom"  value={nom}
              onChange={(e) => setNom(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input  type="email" placeholder="exemple@email.com"  value={email}
              onChange={(e) => setEmail(e.target.value)}  required/>
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input  type="password" placeholder="••••••••" value={mot_de_passe}
              onChange={(e) => setmot_de_passe(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input type="password" placeholder="••••••••" value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)} required/>
          </div>
          <button type="submit" className="btn-inscription">Créer mon compte</button>
          <p className="register-link">Vous avez déjà un compte ? <a href="/Connexion">Se connecter</a></p>
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

export default Inscription;
