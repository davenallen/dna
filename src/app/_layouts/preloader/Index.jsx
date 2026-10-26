const PreloaderModule = () => {
    return (
        <>
        {/* preloader */}
        <div className="dna-preloader">
            {/* preloader content */}
            <div className="dna-preloader-content">
                {/* title */}
                <h4>Artur Carter</h4>
                {/* progressbar */}
                <div id="preloader" className="dna-preloader-load"></div>
            </div>
            {/* preloader content end */}
        </div>
        {/* preloader end */}
        </>
    );
};
export default PreloaderModule;