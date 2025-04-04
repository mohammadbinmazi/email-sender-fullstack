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
    <div className="flex justify-center h-screen items-center flex-col  bg-gradient-to-b from-cyan-200 to-blue-400">
      {isLogin ? (
        <LoginForm onAuthSuccess={onAuthSuccess} />
      ) : (
        <SignupForm onAuthSuccess={onAuthSuccess} />
      )}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="bg-gradient-to-b from-cyan-500 to-blue-800 font-bold rounded-lg py-2 w-50 text-lg text-white  hover:from-cyan-700 hover:to-blue-900 hover:cursor-pointer mt-3 "
      >
        {isLogin ? "Go to Signup" : "Go to Login"}
      </button>
    </div>
  );
};

export default AuthPage;
