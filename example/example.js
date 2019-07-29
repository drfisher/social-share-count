(function(window) {
  var doc = window.document;
  var output, form;

  /**
   * Entry point
   */
  function init() {
    form = document.forms[0];
    output = document.querySelector("#output");

    form.addEventListener("submit", submitHandler);
  }

  /**
   * @param {FormEvent} e
   */
  function submitHandler(e) {
    e.preventDefault();
  }

  function renderOutput() {}

  if (doc.readyState !== "loading") {
    init();
  } else {
    doc.addEventListener("DOMContentLoaded", init);
  }
})(window);
