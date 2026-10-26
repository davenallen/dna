import Data from "@data/sections/why-hire.json";
import { Card, SectionTitle } from "@components/system";

const WhyHireSection = () => {
  return (
    <div className="container-fluid dna-section-block">
      <div className="row">
        <div className="col-lg-12">
          <SectionTitle title={Data.title} />
          {Data.intro && (
            <p className="mb-30 dna-why-hire-intro">{Data.intro}</p>
          )}
        </div>

        {Data.items.map((item, key) => (
          <div className="col-lg-4 col-md-6" key={`why-hire-item-${key}`}>
            <Card className="dna-hire-point">
              <div className="dna-hire-point-num">{String(key + 1).padStart(2, "0")}</div>
              <h5 className="mb-15">{item.title}</h5>
              <div className="mb-0">{item.text}</div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyHireSection;
