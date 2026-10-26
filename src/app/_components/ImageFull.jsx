"use client";


const ImageFull = ({ src, title, video, poster, href = "", plain = false }) => {
  
  const openMedia = () => {
    const mediaSrc = video || src;
    const isVideo = !!video;

    window.dispatchEvent(
      new CustomEvent("openMedia", {
        detail: {
          src: mediaSrc,
          isVideo: isVideo,
          title: title || "",
          href,
        },
      })
    );
  };

  const thumbnail = poster || src;
  const isVideo = !!video;

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            {/* project cover */}
            <div className={`dna-a dna-project-cover${plain ? " dna-project-cover--plain" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openMedia();
                }}
                className="dna-portfolio-item-frame dna-horizontal"
              >
                {/* Thumbnail / Poster */}
                <img src={thumbnail} alt={title} />

                {/* Hover Icon */}
                {isVideo ? (
                  <span className="dna-item-hover dna-video-overlay">
                    <i className="fas fa-play-circle"></i>
                  </span>
                ) : (
                  <span className="dna-item-hover">
                    <i className="fas fa-expand"></i>
                  </span>
                )}
              </a>
            </div>
            {/* project cover end */}
          </div>
        </div>

      </div>
    </>
  );
};

export default ImageFull;