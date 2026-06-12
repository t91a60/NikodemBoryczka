// Hamburger menu toggle for mobile nav
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('nav-open');
            hamburger.setAttribute('aria-expanded', isOpen);
            hamburger.classList.toggle('is-active', isOpen);
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('is-active');
            });
        });
    }
});
