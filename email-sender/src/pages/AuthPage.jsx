import { useState, useEffect } from "react";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";

const AuthPage = ({ onAuthSuccess, defaultToLogin }) => {
  const [isLogin, setIsLogin] = useState(false);

  // Ensure login form shows when defaultToLogin is true
  useEffect(() => {
    setIsLogin(defaultToLogin);
  }, [defaultToLogin]);

  return (
    <div>
      {isLogin ? (
        <LoginForm onAuthSuccess={onAuthSuccess} />
      ) : (
        <SignupForm onAuthSuccess={onAuthSuccess} />
      )}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Go to Signup" : "Go to Login"}
      </button>
    </div>
  );
};

export default AuthPage;
