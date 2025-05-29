import React, { useState } from "react";
import emailjs from "emailjs-com";
import { FaLinkedin, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"; // Importing icons

const Home_Page_Contact_Us = () => {
  // State to handle form inputs
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name,
      contact,
      email,
      message,
    };

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_USER_ID"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  return (
    <section className="py-14 bg-[#faf5fa]">
      <h1 className="text-4xl text-center font-bold text-[#363636]">
        Get{" "}
        <span className="font-signature text-[#800080] text-5xl px-1">In</span>
        {"  "}Touch
      </h1>

      <div className="flex justify-center mt-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Id
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#800080] text-white font-semibold py-2 rounded-md"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-[#363636]">
          Let’s Create Something Extraordinary Together!
        </h2>
        <p className="mt-4 text-lg text-[#363636]">
          For collaborations, inquiries, or to learn more about Chethan
          Jodidhar’s work, please reach out via the following channels:
        </p>
        <div className="mt-6">
          <p className="text-lg text-[#363636]">
            • Email:{" "}
            <a
              href="mailto:filmdirectorchethan@gmail.com"
              className="text-[#800080]"
            >
              filmdirectorchethan@gmail.com
            </a>
          </p>
          <p className="text-lg text-[#363636]">
            • Phone:{" "}
            <a
              href="tel:+918971976109"
              className="text-[#800080]"
            >
              +91 8971976109
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home_Page_Contact_Us;
