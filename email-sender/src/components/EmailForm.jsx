import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import UsersList from "./User";

const EmailForm = ({ onLogout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceId = "service_7ztcscn";
    const templateId = "template_258wn6a";
    const publicKey = "t8SCSKS0NG9nvJP00";

    const templateParam = {
      from_name: name,
      from_email: email,
      to_name: "Mohammad bin Mazi",
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParam, publicKey)
      .then((response) => {
        console.log("Email sent successfully", response);
        setSuccessMessage("✅ Email sent successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3s
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        setSuccessMessage("❌ Email failed to send. Try again.");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Sender Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-10 relative">
          <h2 className="text-4xl font-extrabold text-center text-teal-600 mb-8">
            📧 Email Sender
          </h2>

          {successMessage && (
            <div className="mb-4 text-center bg-green-100 text-green-800 font-medium py-2 px-4 rounded-lg transition-all duration-300">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Recipient Email
              </label>
              <input
                type="email"
                placeholder="Receiver's Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Message
              </label>
              <textarea
                placeholder="Write something nice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "🚀 Send Email"}
            </button>
          </form>

          <button
            onClick={onLogout}
            className="mt-6 w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Users List Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-6 overflow-y-auto max-h-[80vh]">
          <h3 className="text-2xl font-bold mb-4 text-gray-700 text-center">
            👥 User List
          </h3>
          <UsersList />
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
