import { useState } from "react";

const SignupForm = ({ onAuthSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token); // Save JWT token
      onAuthSuccess(); // Move to contact page
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex flex-col justify-center h-100 r justify-items-center items-center w-130 bg-gray-200 rounded-lg">
      <form
        onSubmit={handleSignup}
        className="auth-form flex flex-col text-lg black w-60 h-40 gap-2 mb-40"
      >
        <div className="flex justify-center">
          <h2 className="text-2xl  ">Sign Up Form</h2>
        </div>
        <div>
          <label htmlFor="" className="">
            Name
          </label>
          <input
            type="text"
            placeholder=" Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-black rounded-md w-60 h-12 "
          />
        </div>
        <div>
          <label htmlFor="" className="">
            Email
          </label>
          <input
            type="email"
            placeholder=" Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-black rounded-md w-60 h-12 "
          />
        </div>
        <div>
          <label htmlFor="" className="">
            Password
          </label>
          <input
            type="password"
            placeholder=" Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2  border-black rounded-md w-60 h-12 "
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-b from-cyan-400 to-blue-600 text-lg text-black font-bold rounded-lg py-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-blue-800 hover:from-cyan-700 hover:to-blue-900"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
