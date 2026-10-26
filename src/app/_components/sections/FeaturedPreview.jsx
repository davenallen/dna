"use client";

export default function FeaturedPreview({ src, thumb, title, href = "" }) {
  const open = () => {
    window.dispatchEvent(
      new CustomEvent("openMedia", {
        detail: {
          src,
          isVideo: false,
          title: title || "",
          href,
        },
      })
    );
  };

  return (
    <button
      type="button"
      className="dna-featured-card-media dna-featured-card-media--preview"
      onClick={open}
      aria-label={`Preview ${title}`}
    >
      <img src={thumb || src} alt={title} />
      <span className="dna-featured-card-hover" aria-hidden="true">
        <i className="fas fa-expand" />
      </span>
    </button>
  );
}
