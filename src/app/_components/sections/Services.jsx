import Data from "@data/sections/services.json";
import { SectionTitle, TextLink } from "@components/system";

const ServicesSection = () => {
  return (
    <div className="container-fluid dna-section-block">
      <div className="row">
        <div className="col-lg-12">
          <SectionTitle title={Data.title} />
        </div>

        {Data.items.map((item, key) => (
          <div className="col-lg-6" key={`services-item-${key}`}>
            <div className="dna-a dna-service-icon-box">
              <div className="dna-service-ib-content">
                <h5 className="mb-15">{item.title}</h5>
                <div className="mb-15">{item.text}</div>
                {item.button && (
                  <div className="dna-buttons-frame">
                    <TextLink href={item.button.link}>{item.button.label}</TextLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
