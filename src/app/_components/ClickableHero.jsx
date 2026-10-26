"use client";

import ImageFull from "./ImageFull";

const ClickableHero = ({ image, title, iframeSrc, href = "" }) => {
  const openPreview = () => {
    window.dispatchEvent(
      new CustomEvent("openMedia", {
        detail: {
          src: iframeSrc,
          isIframe: true,
          title: title || "Live Preview",
          href,
        },
      })
    );
  };

  return (
    <div 
      onClick={openPreview}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <ImageFull src={image} title={title} href={href} />
      
      <div style={{
        position: "absolute",
        top: "10px",
        right: "40px",
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: "4px",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        zIndex: 10,
        pointerEvents: "none",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
      }}>
        <i className="fas fa-external-link-alt"></i>
        Live Preview
      </div>
    </div>
  );
};

export default ClickableHero;