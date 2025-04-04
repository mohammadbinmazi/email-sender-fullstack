// import { useState, useEffect } from "react";
// import AuthPage from "./pages/AuthPage";
// import ContactPage from "./pages/ContactPage";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setIsAuthenticated(true);
//   }, []);

//   return isAuthenticated ? (
//     <ContactPage />
//   ) : (
//     <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [defaultToLogin, setDefaultToLogin] = useState(false); // Track login state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setDefaultToLogin(true); // Ensure login form shows on next render
  };

  return isAuthenticated ? (
    <ContactPage onLogout={handleLogout} />
  ) : (
    <AuthPage
      onAuthSuccess={() => setIsAuthenticated(true)}
      defaultToLogin={defaultToLogin}
    />
  );
}

export default App;
