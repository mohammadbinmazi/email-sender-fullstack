import { useState } from "react";

const SignupForm = ({ onAuthSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" }); // success or error

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({ message: "✅ Signup successful!", type: "success" });
        setTimeout(() => {
          setFeedback({ message: "", type: "" });
          onAuthSuccess(); // move to login or whatever's next
        }, 1500);
      } else {
        setFeedback({
          message: data.error || "❌ Signup failed.",
          type: "error",
        });
        setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setFeedback({ message: "⚠️ Something went wrong.", type: "error" });
      setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
    }
  };

  return (
    <div className=" flex items-center justify-center ">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          ✍️ Sign Up Form
        </h2>

        {feedback.message && (
          <div
            className={`text-center py-2 px-4 mb-4 rounded-lg font-semibold transition-all duration-300 ${
              feedback.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
