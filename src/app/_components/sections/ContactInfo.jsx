import Data from "@data/sections/contact-info.json";
import { Card, InfoRow, SectionTitle } from "@components/system";

const ContactInfoSection = () => {
  return (
    <>
        {/* contact info */}
        <div className="container-fluid">

        {/* row */}
        <div className="row p-30-0">

            {/* col */}
            <div className="col-lg-12">

            {/* section title */}
            <SectionTitle title={Data.title} />

            </div>
            {/* col end */}

            {Data.items.map((item, key) => (
            <div className="col-lg-4" key={`contact-info-item-${key}`}>
                {/* contact card */}
                <Card>
                    <div className="dna-table p-15-15">
                    <ul>
                        {item.info.map((info_item) => (
                        <InfoRow
                            key={`${key}-${info_item.label}`}
                            label={info_item.label}
                            value={info_item.value}
                        />
                        ))}
                    </ul>
                    </div>
                </Card>
                {/* contact card end */}
            </div>
            ))}

        </div>
        {/* row end */}

        </div>
        {/* contact info end */}
    </>
  );
};

export default ContactInfoSection;