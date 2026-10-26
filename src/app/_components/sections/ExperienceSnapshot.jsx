import Data from "@data/sections/experience-snapshot.json";
import { Card, SectionTitle, TextLink } from "@components/system";

const ExperienceSnapshotSection = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <SectionTitle
            title={Data.title}
            aside={Data.viewAll ? <TextLink href={Data.viewAll.link}>{Data.viewAll.label}</TextLink> : null}
          />
        </div>

        {Data.items.map((item, key) => (
          <div className="col-lg-6" key={`exp-snap-${key}`}>
            <Card className="dna-exp-card">
              <div className="dna-exp-card-meta">
                <span className="dna-exp-card-date">{item.date}</span>
              </div>
              <h5 className="mb-5">{item.title}</h5>
              <div className="dna-el-suptitle mb-15">{item.subtitle}</div>
              <p className="mb-0">{item.text}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSnapshotSection;
