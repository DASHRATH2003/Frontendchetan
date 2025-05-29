import React from "react";
import ContactUsBanner from "./components/ContactUsBanner";
import ContactMap from "./components/ContatMap";

const Contact = () => {
  return (
    <>
      <section>
        <ContactUsBanner />
      </section>
      <section>
        <ContactMap/>
      </section>
    </>
  );
};

export default Contact;
