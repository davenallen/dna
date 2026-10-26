import dynamic from "next/dynamic";

import Footer from "@layouts/footers/Index";
import MenuBar from "@layouts/menu-bar/Index";
import MobileHeader from "@layouts/mobile-header/Index";
import TopBackground from "@layouts/top-background/Index";

const InfoBar = dynamic(() => import("@layouts/info-bar/Index"), { ssr: false });

const PagesLayouts = ({ children }) => {
  return (
    <>
      <div className="dna-app-wrapper">
        <MobileHeader />
        <div className="dna-app-container">
          <InfoBar />

          <div className="dna-content">
            <TopBackground />

            <div className="transition-fade" id="swup">
              <div id="scrollbar" className="dna-scroll-frame">
                {children}

                <Footer layout={"default"} />
              </div>
            </div>
          </div>

          <MenuBar />
        </div>
      </div>
    </>
  );
};

export default PagesLayouts;
