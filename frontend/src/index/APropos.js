import React from "react";
import "./APropos.css";

function APropos() {
  return (
    <div className="apropos-container">
      <section className="hero-apropos">
        <h1>À propos de <span>Rania Beauty</span></h1>
        <p>✨ Sublimer votre beauté naturelle avec élégance ✨</p>
      </section>

      <section className="contenu-apropos">
        <h2>Notre histoire</h2>
        <p>
          Rania Beauty est née de la passion pour les cosmétiques naturels et l’envie d’offrir des produits de qualité,
          accessibles et respectueux de votre peau. Depuis notre création, nous nous engageons à valoriser la beauté
          authentique de chaque femme.
        </p>

        <h2>Nos valeurs</h2>
        <ul>
          <li><strong>🌱 Naturel :</strong> Des ingrédients choisis avec soin, sans compromis sur la qualité.</li>
          <li><strong>❤️ Éthique :</strong> Non testés sur les animaux, respectueux de l’environnement.</li>
          <li><strong>✨ Confiance :</strong> Une transparence totale sur la composition de nos produits.</li>
        </ul>

        <h2>Notre mission</h2>
        <p>
          Nous souhaitons accompagner chaque personne dans sa routine beauté avec des produits efficaces,
          doux et conçus avec amour. Parce que chaque peau mérite le meilleur, notre mission est de
          révéler votre éclat naturel au quotidien.
        </p>
      </section>
    </div>
  );
}

export default APropos;
