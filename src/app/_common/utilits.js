export const AnchorScroll = () => {
    // anchor scroll
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        event.preventDefault();

        var target = document.querySelector(link.getAttribute('href'));
        var offset = 0;

        if ( window.innerWidth < 1200 ) {
          offset = 90;
        }
  
        window.scrollTo({
            top: target.offsetTop - offset,
            behavior: "smooth"
        });
      });
    });
};