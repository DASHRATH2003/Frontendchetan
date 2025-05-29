import React from "react";

const ContactMap = () => {
  return (
    <div className="w-full h-[300px] md:h-[450px] lg:h-[500px]">
      <iframe
        className="w-full h-full border-0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.719230584889!2d77.57209037538163!3d12.989801387327244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae170030771e61%3A0x1bd7dec2a9f95f09!2sChethan%20Cinemas!5e0!3m2!1sen!2sin!4v1739516411249!5m2!1sen!2sin"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default ContactMap;
