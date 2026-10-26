/* Posts a form into the Google Sheet web app.

   The script reply cannot load inside this site, so the page sends the
   fields and does not read the reply. A network failure still rejects. */
(function () {
  var URL = "https://script.google.com/macros/s/AKfycbwBZc2kHkMr56ejoEU6R8eAaEutKzK7VsHi3iLRPN_eYtSxQagUdf32g-ZpFmxVDTlR_A/exec";
  var SECRET = "fBeskCulIl0olLNT5gJOq_hakD259Ixt";

  window.dnaPostSheet = function (fields) {
    var data = new URLSearchParams();
    data.set("secret", SECRET);
    ["form", "page", "name", "email", "phone", "message", "description", "detail"].forEach(function (key) {
      data.set(key, fields[key] || "");
    });
    return fetch(URL, { method: "POST", mode: "no-cors", body: data });
  };
}());
