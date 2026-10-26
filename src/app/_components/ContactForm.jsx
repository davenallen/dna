"use client";

import { Formik } from 'formik';
import { Button, FormField } from "@components/system";
import { postToSheet } from "@library/sheet";
import { track, trackOnce } from "@library/visit";

const ContactForm = () => {
  return (
    <>
        {/* contact form */}
        <Formik
        initialValues = {{ email: '', name: '', message: '' }}
        validate = { values => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Invalid email address';
            }
            return errors;
        }}
        onSubmit = {async (values, { setSubmitting, resetForm }) => {
    const status = document.getElementById("contactFormStatus");

    // Reset status first
    status.style.display = "none";
    status.innerHTML = "";

    setSubmitting(true);

    try {
        await postToSheet({
            form: "contact",
            page: window.location.pathname,
            name: values.name.trim(),
            email: values.email.trim(),
            message: values.message.trim(),
        });

        track("generate_lead", { form_id: "contact" });
        status.innerHTML = `<h5>✅ Thanks, your message was sent successfully.</h5>`;
        status.style.display = "block";
        resetForm();
    } catch (error) {
        status.innerHTML = `<h5>Oops! There was a problem submitting your form</h5>`;
        status.style.display = "block";
    } finally {
        setSubmitting(false);
    }
}}
        >
        {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
        }) => {
        const onStart = () => trackOnce("contact-form", "form_start", { form_id: "contact" });
        return (
        <form onSubmit={handleSubmit} onFocusCapture={onStart} id="contactForm" action="#contact" className="dna-contact-form">
            {/* form field */}
            <FormField
                id="name"
                name="name"
                label="Name"
                icon={<i className="fas fa-user"></i>}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
            />
            <FormField
                id="email"
                name="email"
                type="email"
                label="Email"
                icon={<i className="fas fa-at"></i>}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
            />
            <FormField
                as="textarea"
                id="message"
                name="message"
                label="Message"
                icon={<i className="far fa-envelope"></i>}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
            />
            {/* form field end */}
            {/* button */}
            <div className="dna-submit-frame">
                <Button className="dna-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send message"}
                </Button>
                {/* success */}
                <div className="dna-success">Success <i className="fas fa-check"></i></div>
            </div>
            {/* button end */}
            
            <div className="form-status" id="contactFormStatus" style={{"display": "none"}} />
        </form>
        );
        }}
        </Formik>
        {/* contact form end */}
    </>
  );
};
export default ContactForm;