import React, { useRef } from "react";
import { FaLinkedin, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import emailjs from "@emailjs/browser";

const ContactUsBanner = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        form.current,
        "YOUR_PUBLIC_KEY" // Replace with your EmailJS public key
      )
      .then(
        (result) => {
          alert("Message Sent Successfully!");
          console.log(result.text);
          e.target.reset();
        },
        (error) => {
          alert("Message Failed to Send.");
          console.log(error.text);
        }
      );
  };

  return (
    <section className="bg-[#faf5fa] py-24 px-5">
      {/* Page Title */}
      <section className="flex items-center flex-col gap-5 mb-10">
        <h1 className="text-[#48A77E] text-center font-bold text-5xl">
          Let’s Create Something Extraordinary Together!
        </h1>
        <div className="bg-[#800080] h-1 w-20 flex"></div>
      </section>

      {/* Contact Info */}
      <section className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Details */}
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold text-gray-800">
            Contact Information
          </h2>
          <p className="text-lg text-gray-600">
            For collaborations, inquiries, or to learn more about Chethan
            Jodidhar’s work, please reach out via the following channels:
          </p>
          <div className="flex items-center gap-3 text-lg text-gray-700">
            <MdEmail className="text-[#48A77E] text-2xl" />
            <span>filmdirectorchethan@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 text-lg text-gray-700">
            <MdPhone className="text-[#48A77E] text-2xl" />
            <span>+91 8971976109</span>
          </div>
          <div className="flex gap-5 mt-5">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-[#0077b5] text-3xl hover:scale-110 transition" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-[#C13584] text-3xl hover:scale-110 transition" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-[#1DA1F2] text-3xl hover:scale-110 transition" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-[#FF0000] text-3xl hover:scale-110 transition" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-5">
            Send a Message
          </h2>
          <form ref={form} onSubmit={sendEmail} className="space-y-5">
            <div>
              <label
                htmlFor="user_name"
                className="block font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="user_name"
                id="user_name"
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#48A77E]"
              />
            </div>
            <div>
              <label
                htmlFor="user_email"
                className="block font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="user_email"
                id="user_email"
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#48A77E]"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="5"
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#48A77E]"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#48A77E] text-white font-medium px-6 py-3 rounded-md hover:bg-[#3b8c6e] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </section>
  );
};

export default ContactUsBanner;
