import Data from "@data/sections/pricing.json";
import { SectionTitle, TextLink } from "@components/system";

const PricingSection = () => {
    return (
        <>
        {/* pricing */}
        <div className="container-fluid">

        {/* row */}
        <div className="row p-0-0">

            {/* col */}
            <div className="col-lg-12">

            {/* section title */}
            <SectionTitle title={Data.title} />
            {/* section title end */}

            </div>
            {/* col end */}
            
            {Data.items.map((item, key) => (
                <div className="col-lg-4" key={`pricing-card-${key}`}>
                    {/* price */}
                    <div className={item.popular != 1 ? "dna-a dna-price" : "dna-a dna-price dna-popular-price"}>
                        {/* price body */}
                        <div className="dna-price-body">
                            <h5 className="mb-30">{item.title}</h5>

                            {/* price cost */}
                            <div className="dna-price-cost">
                                <div className="dna-number">
                                    <span>{item.price.before}</span>
                                    <div dangerouslySetInnerHTML={{__html : item.price.value}} />
                                    <span>{item.price.after}</span>
                                </div>
                            </div>
                            {/* price cost end */}

                            {/* price list */}
                            <ul className="dna-price-list">
                                {item.list.map((list_item, list_key) => (
                                    <li 
                                        key={`pricing-item-${key}-list-${list_key}`} 
                                        className={list_item.active ? "" : "dna-empty-item"}
                                    >
                                        {list_item.value}
                                    </li>
                                ))}
                            </ul>
                            {/* price list end */}

                            {/* button */}
                            <TextLink href={item.button.link}>{item.button.label}</TextLink>
                            <div className="dna-asterisk" dangerouslySetInnerHTML={{__html : item.info}} />
                        </div>
                        {/* price body end */}
                    </div>
                    {/* price end */}
                </div>
            ))}

        </div>
        {/* row end */}

        </div>
        {/* prices end */}
        </>
    );
};

export default PricingSection;