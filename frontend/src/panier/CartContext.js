import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();
 function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const fetchCartCount = () => {
      const id_utilisateur = localStorage.getItem("utilisateur_id");
      if (!id_utilisateur) {
        setCartCount(0);
        return;
      }

      fetch(`http://localhost:5000/api/panier/count?id_utilisateur=${id_utilisateur}`)
        .then((res) => res.json())
        .then((data) => setCartCount(data.total || 0))
        .catch((err) => console.error("Erreur panier :", err));
    } ;

    fetchCartCount();

    // 🔥 Recharger quand localStorage change (connexion/déconnexion)
    window.addEventListener("storage", fetchCartCount);

    return () => window.removeEventListener("storage", fetchCartCount);
  }, [window.location.pathname]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
export default CartProvider;