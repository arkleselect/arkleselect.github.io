document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

  burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnBurger = burger.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnBurger && nav.classList.contains('nav-active')) {
      nav.classList.remove('nav-active');
      burger.classList.remove('toggle');
      navLinks.forEach((link) => {
        link.style.animation = '';
      });
    }
  });
});