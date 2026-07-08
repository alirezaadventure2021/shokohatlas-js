import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

const ContactForm = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          message: message,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFullName("");
        setEmail("");
        setMessage("");
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className=" flex flex-col gap-2 text-black/60"
      onSubmit={handleSubmit}
    >
      <p className="text-secondry">{success ? t("ContactPage.success") : ""}</p>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <label htmlFor="fullName" className="text-sm">
        {t("ContactPage.name")}
      </label>
      <input
        name="fullName"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder={t("ContactPage.nameInput")}
        className="bg-grey px-4 py-2 rounded-xl focus:outline-none "
        required
      />
      <label htmlFor="email" className="text-sm">
        {t("ContactPage.email")}
      </label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("ContactPage.emailInput")}
        className="bg-grey px-4 py-2 rounded-xl focus:outline-none "
        required
      />
      <label htmlFor="message" className="text-sm">
        {t("ContactPage.message")}
      </label>
      <textarea
        name="message"
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={7}
        cols={50}
        placeholder={t("ContactPage.messageInput")}
        className="bg-grey px-4 py-2 rounded-xl focus:outline-none "
        required
      ></textarea>

      {isLoading ? (
        <div className="px-4 py-3 mt-[4px] text-white  text-center bg-gradient-to-r from-black/70 to-black/20 rounded-xl">
          {t("ContactPage.button")}
        </div>
      ) : (
        <button
          type="submit"
          className="px-4 py-3 mt-[4px] text-white bg-gradient-to-r from-red to-primary rounded-xl"
        >
          {t("ContactPage.button")}
        </button>
      )}
    </form>
  );
};

export default ContactForm;
