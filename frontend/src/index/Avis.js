import { useEffect, useState } from "react";
import "./Avis.css";

function AvisClients() {
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/avis")
      .then((res) => res.json())
      .then((data) => setAvis(data))
      .catch((err) => console.error("Erreur de chargement des avis :", err));
  }, []);

  return (
   
      <section className="avis-section">
        <h2 className="section-title">🗣️ Avis de nos clients</h2>

        <div className="avis-container">
          {avis.map((avis) => (
            <div className="avis-box" key={avis.id}>
              <h4 className="avis-nom">👤 {avis.nom}</h4>
              <p className="avis-commentaire">“{avis.commentaire}”</p>
              <p className="avis-note">⭐ {avis.note} / 5</p>
            </div>
          ))}
        </div>
      </section>
  
  );
}

export default AvisClients;


