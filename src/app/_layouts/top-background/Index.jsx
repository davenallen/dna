import AppData from "@data/app.json";

const TopBackgroundModule = () => {
    return (
        <>
            {/* curtain */}
            <div className="dna-curtain"></div>

            {/* top background */}
            <div className="dna-top-bg" style={{"backgroundImage": "url("+AppData.header.topBackground+")" }}>
              {/* overlay */}
              <div className="dna-top-bg-overlay"></div>
              {/* overlay end */}
            </div>
            {/* top background end */}
        </>
    );
};
export default TopBackgroundModule;
