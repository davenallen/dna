import React from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";

import ContactFormSection from "@components/sections/Contact";
import ContactInfoSection from "@components/sections/ContactInfo";

const TestimonialSlider = dynamic(() => import("@components/sliders/Testimonial"), { ssr: false });

export const metadata = {
    title: {
        default: "Contact — Hire David N Allen",
    },
    description: "Contact David N Allen about a senior product front-end seat. Lakewood, CO. React, Next.js, and the events those pages fire. Email david@davidnallen.com.",
}

const ContactPage = () => {
  return (
    <>
      <ContactFormSection  />
      <TestimonialSlider />
      <ContactInfoSection />
    </>
  );
};
export default ContactPage;
