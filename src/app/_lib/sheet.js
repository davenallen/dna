let loading;

function ready() {
  if (typeof window === "undefined") return Promise.reject(new Error("The sheet is only available in the browser."));
  if (window.dnaPostSheet) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/js/sheet-post.js";
      script.onload = () => resolve();
      script.onerror = () => {
        loading = null;
        reject(new Error("The sheet script did not load."));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

export function postToSheet(fields) {
  return ready().then(() => window.dnaPostSheet(fields));
}
