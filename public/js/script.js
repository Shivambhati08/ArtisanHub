// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();


document.addEventListener("DOMContentLoaded", function () {
    const navbarCollapse = document.getElementById("navbarNavAltMarkup");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (!navbarCollapse || !navbarToggler) return;

    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false
    });

    document.addEventListener("click", function (e) {
        if (
            navbarCollapse.classList.contains("show") &&
            !navbarCollapse.contains(e.target) &&
            !navbarToggler.contains(e.target)
        ) {
            bsCollapse.hide();
        }
    });

    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
        link.addEventListener("click", () => {
            bsCollapse.hide();
        });
    });
});