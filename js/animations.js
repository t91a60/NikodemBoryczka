// IntersectionObserver: fade-in on scroll
document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in');

    if (fadeEls.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Fire once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: ['0px', '0px', '-40px', '0px'].join(' ')
    });

    fadeEls.forEach(el => observer.observe(el));
});
