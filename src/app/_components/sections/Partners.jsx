import Data from '@data/sections/partners';
import { SectionTitle } from "@components/system";

const PartnersSlider = ( { paddingTop } ) => {
  return (
    <div className="container-fluid dna-section-block">
      <div className={`row p-${paddingTop || 0}-0`}>
        {Data.title && (
          <div className="col-lg-12">
            <SectionTitle title={Data.title} />
          </div>
        )}
        {Data.items.map((item, key) => (
          <div className="col-6 col-lg-3" key={`partners-slider-item-${key}`}>
            <img className="dna-brand" src={item.image} alt={item.alt} title={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default PartnersSlider;
