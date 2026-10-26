"use client";

import Data from "@data/sections/counters.json";
import { useEffect } from "react";
import { CountersBarAnim } from "@common/counters";

const CountersSection = () => {
  useEffect(() => {
    CountersBarAnim();
  }, []);

  return (
    <>
        {/* counters */}
        <div className="container-fluid">

        {/* row */}
        <div className="row p-30-0">
            
            {Data.items.map((item, key) => (
            <div className={Data.items.length === 3 ? "col-md-4 col-6" : "col-md-3 col-6"} key={`counters-item-${key}`}>
                {/* counter frame */}
                <div className="dna-counter-frame">
                    {/* counter */}
                    <div className="dna-counter-box">
                        {item.static ? (
                          <span className="dna-counter dna-counter-static">{item.value}</span>
                        ) : (
                          <>
                            <span className="dna-counter" data-count={item.value}>0</span>
                            <span className="dna-counter-plus">{item.valueAfter}</span>
                          </>
                        )}
                    </div>
                    {/* counter end */}
                    {/* title */}
                    <h6>{item.label}</h6>
                </div>
                {/* counter frame end */}
            </div>
            ))}

        </div>
        {/* row end */}

        </div>
        {/* counters end */}
    </>
  );
};
export default CountersSection;
