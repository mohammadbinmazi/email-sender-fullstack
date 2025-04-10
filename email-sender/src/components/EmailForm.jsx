import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import UsersList from "./User";

const EmailForm = ({ onLogout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Email Sender
        </h2>

        <form onSubmit={handleSubmit} className="emailForm space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />

          <textarea
            cols="30"
            rows="5"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition duration-300"
          >
            Send Email
          </button>
        </form>

        <button
          onClick={onLogout}
          className="mt-4 w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
      <UsersList />
    </div>
  );
};

export default EmailForm;
