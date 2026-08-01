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


// ================= Navbar Auto Close =================
document.addEventListener("DOMContentLoaded", function () {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (!navbarCollapse || !navbarToggler) return;

    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (
            navbarCollapse.classList.contains("show") &&
            !navbarCollapse.contains(e.target) &&
            !navbarToggler.contains(e.target)
        ) {
            bsCollapse.hide();
        }
    });

    // Close when a nav link is clicked
    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
        link.addEventListener("click", () => {
            bsCollapse.hide();
        });
    });
});