document.addEventListener('DOMContentLoaded', () => {

    // === Hamburger Menu ===
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            navLinks?.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // === Navbar scroll style ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // === Scroll Reveal ===
    const reveals = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => revealObserver.observe(el));

    // === Smooth scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = navbar.offsetHeight;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // === Typing effect ===
    const typingEl = document.getElementById('typing-name');
    const text = 'Laura Pirolli Furlin';
    let i = 0;
    let typed = false;

    function type() {
        if (typed) return;
        typed = true;
        typingEl.textContent = '';

        const typeChar = () => {
            if (i < text.length) {
                typingEl.textContent = text.slice(0, i + 1);
                i++;
                setTimeout(typeChar, 85);
            } else {
                typingEl.innerHTML = typingEl.textContent + '<span class="cursor"></span>';
            }
        };
        typeChar();
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(type, 300);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const heroSection = document.getElementById('home');
    if (heroSection) heroObserver.observe(heroSection);

    // === Contact form ===
    const form = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            formMsg.textContent = 'Enviando...';
            formMsg.style.color = 'var(--primary)';

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) {
                    formMsg.textContent = 'Mensagem enviada! Obrigada pelo contato.';
                    formMsg.style.color = '#22c55e';
                    form.reset();
                } else {
                    throw new Error();
                }
            } catch {
                formMsg.textContent = 'Erro ao enviar. Tente por email diretamente.';
                formMsg.style.color = '#ef4444';
            }

            setTimeout(() => { formMsg.textContent = ''; }, 5000);
        });
    }
});
