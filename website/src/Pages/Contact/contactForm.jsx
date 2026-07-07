import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import emailjs from "@emailjs/browser";

const ContactForm = ()=>{
    const {t} = useTranslation();
    const [fullName, setFullName] = useState('');
    const [email , setEmail] = useState('');
    const [message, setMessage]= useState('');
    const [success, setSuccess] = useState(false);
    const form = useRef();
    const [isLoading , setLoading] = useState(false);

    const nameChange = (e) =>{
        setFullName(e.target.value);
    }
    const emailChange = (e) =>{
        setEmail(e.target.value);
    }
    const messageChange = (e) =>{
        setMessage(e.target.value);
    }

    const sendEmail =(e)=>{
        e.preventDefault();
        setLoading(true);
        emailjs
            .sendForm('service_nosi3pj' , 'template_jrtg6ww', form.current, {
                publicKey: "on4oYlIFuPLf-9TN9"
            })
            .then(
                ()=>{
                    setSuccess(true);
                    setFullName('');
                    setEmail('');
                    setMessage('');
                    setLoading(false);
                },
                (error)=>{
                    console.log(error.text)
                }
            )
    }

return(
    <form action="" className=" flex flex-col gap-2 text-black/60" ref={form} onSubmit={sendEmail}>
        <p className="text-secondry" >{success ? t('ContactPage.success') : ""}</p>
        <label htmlFor="fullName" className="text-sm">
            {t("ContactPage.name")}
        </label>
        <input
            name="fullName"
            type="text"
            value={fullName}
            onChange={nameChange}
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
            onChange={emailChange}
            placeholder={t("ContactPage.emailInput")}
            className="bg-grey px-4 py-2 rounded-xl focus:outline-none "
            required
        />
        <label htmlFor="message" className="text-sm">
            {t("ContactPage.email")}
        </label>
        <textarea
            name="message"
            id="message"
            value={message}
            onChange={messageChange}
            rows={7}
            cols={50}
            placeholder={t("ContactPage.emailInput")}
            className="bg-grey px-4 py-2 rounded-xl focus:outline-none "
            required
        ></textarea>

        {isLoading ? (
            <div  className="px-4 py-3 mt-[4px] text-white  text-center bg-gradient-to-r from-black/70 to-black/20 rounded-xl">
                {t("ContactPage.button")}
            </div>
        ):(
            <button type="submit" className="px-4 py-3 mt-[4px] text-white bg-gradient-to-r from-red to-primary rounded-xl">
                {t("ContactPage.button")}
            </button>
        )}

    </form>)

}

export default ContactForm;

