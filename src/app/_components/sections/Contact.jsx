import Data from "@data/sections/contact.json";
import ContactForm from "@components/ContactForm";
import { Card, SectionTitle } from "@components/system";

const ContactSection = () => {
  return (
    <>
        {/* contact */}
        <div className="container-fluid">

        {/* row */}
        <div className="row p-30-0 p-lg-30-0 p-md-15-0">

        {/* col */}
        <div className="col-lg-12">

        {/* section title */}
        <SectionTitle title={Data.title} />

        <Card>
            <ContactForm />
        </Card>
        {/* contact form frame end */}

        </div>
        {/* col end */}

        </div>
        {/* row end */}

        </div>
        {/* contact end */}
    </>
  );
};
export default ContactSection;