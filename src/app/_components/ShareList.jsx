"use client";

import { useState } from "react";

const popup = "height=500,width=700,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no";

function withUtm(source) {
  const url = new URL(window.location.href);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "page_share");
  return url.toString();
}

function openPopup(href) {
  window.open(href, "popUpWindow", popup);
}

const ShareList = () => {
  const [note, setNote] = useState("");

  const flash = (message) => {
    setNote(message);
    window.setTimeout(() => setNote(""), 4000);
  };

  const copy = async (source) => {
    const link = withUtm(source);
    await navigator.clipboard.writeText(link);
    return link;
  };

  const shareOnFacebook = () => {
    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(withUtm("facebook"))}`;
    openPopup(href);
  };

  const shareOnX = () => {
    const text = encodeURIComponent("Check this out!");
    const href = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(withUtm("twitter"))}`;
    openPopup(href);
  };

  const shareOnInstagram = async () => {
    try {
      await copy("instagram");
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      flash("Link copied. Paste it into an Instagram story or post.");
    } catch {
      flash("Could not copy the link.");
    }
  };

  const copyLink = async () => {
    try {
      await copy("copy_link");
      flash("Link copied.");
    } catch {
      flash("Could not copy the link.");
    }
  };

  return (
    <div className="dna-share">
      <h6>Share this page</h6>
      <ul className="dna-share-list">
        <li>
          <button type="button" onClick={shareOnFacebook} aria-label="Share on Facebook" title="Share on Facebook">
            <svg className="social-facebook" xmlns="http://www.w3.org/2000/svg" viewBox="9.41 8.9 26.19 26.19" aria-hidden="true">
              <path d="M20.25,33h3.89V23h3.24l.49-3.91H24.14v-2.5c0-1.13.3-1.9,1.87-1.9h2v-3.5A25.61,25.61,0,0,0,25.1,11c-2.88,0-4.85,1.82-4.85,5.17V19H17v4h3.25V33Z" />
            </svg>
          </button>
        </li>
        <li>
          <button type="button" onClick={shareOnX} aria-label="Share on X" title="Share on X">
            <svg className="social-x" xmlns="http://www.w3.org/2000/svg" viewBox="235 248.34 730 730" aria-hidden="true">
              <path d="M657.082 566.392 880.445 306.75h-52.93L633.568 532.193 478.664 306.75H300l234.246 340.91L300 919.935h52.933l204.813-238.076 163.59 238.076H900L657.068 566.392h.014Zm-72.5 84.272-23.733-33.947-188.844-270.12h81.303l152.398 217.995 23.734 33.947L827.54 881.9h-81.302L584.582 650.677v-.013Z" />
            </svg>
          </button>
        </li>
        <li>
          <button type="button" onClick={shareOnInstagram} aria-label="Share on Instagram" title="Share on Instagram">
            <svg className="social-instagram" xmlns="http://www.w3.org/2000/svg" viewBox="8.9 8.9 26.19 26.19" aria-hidden="true">
              <path d="M22,11c-3,0-3.36,0-4.54.07a8.11,8.11,0,0,0-2.67.51,5.62,5.62,0,0,0-3.22,3.22,8.08,8.08,0,0,0-.51,2.67C11,18.64,11,19,11,22s0,3.36.07,4.53a8.08,8.08,0,0,0,.51,2.67,5.62,5.62,0,0,0,3.22,3.22,8.11,8.11,0,0,0,2.67.51C18.64,33,19,33,22,33s3.36,0,4.54-.07a8.11,8.11,0,0,0,2.67-.51,5.62,5.62,0,0,0,3.22-3.22,8.11,8.11,0,0,0,.51-2.67C33,25.36,33,25,33,22s0-3.36-.07-4.53a8.11,8.11,0,0,0-.51-2.67,5.62,5.62,0,0,0-3.22-3.22,8.11,8.11,0,0,0-2.67-.51C25.36,11,25,11,22,11Zm0,2c2.94,0,3.29,0,4.45.06a6.07,6.07,0,0,1,2,.38,3.64,3.64,0,0,1,2.09,2.09,6.07,6.07,0,0,1,.38,2C31,18.72,31,19.06,31,22s0,3.28-.06,4.45a6.07,6.07,0,0,1-.38,2,3.64,3.64,0,0,1-2.09,2.09,6.07,6.07,0,0,1-2,.38C25.29,31,24.94,31,22,31s-3.29,0-4.45-.06a6.07,6.07,0,0,1-2-.38,3.64,3.64,0,0,1-2.09-2.09,6.07,6.07,0,0,1-.38-2C13,25.29,13,24.94,13,22s0-3.28.06-4.45a6.07,6.07,0,0,1,.38-2,3.64,3.64,0,0,1,2.09-2.09,6.07,6.07,0,0,1,2-.38C18.71,13,19.06,13,22,13Zm0,3.37A5.65,5.65,0,1,0,27.65,22v0h0A5.65,5.65,0,0,0,22,16.35Zm0,9.32A3.67,3.67,0,1,1,25.67,22h0A3.67,3.67,0,0,1,22,25.67Zm7.19-9.54a1.32,1.32,0,1,1-1.32-1.32h0A1.32,1.32,0,0,1,29.19,16.15Z" />
            </svg>
          </button>
        </li>
        <li>
          <button type="button" onClick={copyLink} aria-label="Copy link" title="Copy link">
            <svg className="social-share" xmlns="http://www.w3.org/2000/svg" viewBox="0.14 0.1 23.71 23.71" aria-hidden="true">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
          </button>
        </li>
      </ul>
      {note ? <p className="dna-share-note">{note}</p> : null}
    </div>
  );
};

export default ShareList;
