document.addEventListener('DOMContentLoaded', () => {
    
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('#home');
    const navbarHeight = navbar.offsetHeight;

    // --------------------------------------------------------------------
    // 1. Efeito Parallax de Fundo (na seção #home)
    // --------------------------------------------------------------------
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        const speed = parseFloat(parallaxBg.getAttribute('data-speed')) || -0.1;

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const yOffset = scrollY * speed;
            parallaxBg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        });
    }

    // --------------------------------------------------------------------
    // 2. Parallax de Seções (Uma atrás da Outra)
    // --------------------------------------------------------------------
    const parallaxSections = document.querySelectorAll('.parallax-section');
    const perspectiveAmount = 500; // Define a "distância" para o efeito 3D

    function updateParallaxSections() {
        // Obtenha a posição de rolagem
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        parallaxSections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;

            // Calcula o quanto a seção está visível
            // Quando 0, a seção está no topo da viewport. Quando 1, está no final.
            const scrollRatio = (scrollPosition - sectionTop + windowHeight) / (windowHeight + sectionHeight);
            
            // Ajusta o ratio para o movimento começar quando a seção entra na viewport
            let transformY = 0;
            if (scrollRatio > 0 && scrollRatio < 1) { // A seção está na viewport ou entrando/saindo
                transformY = -(scrollRatio * 100 * 0.3); // Ajuste este valor (0.3) para mais/menos parallax
            } else if (scrollRatio >= 1) { // A seção já passou
                 transformY = -30; // Garante que ela continue "subindo"
            }
            
            // Aplica o transform. O translateZ é crucial para a perspectiva.
            // O transformY faz a seção se mover verticalmente.
            section.style.transform = `translateZ(-${perspectiveAmount * index}px) translateY(${transformY}%) scale(${1 + (index * 0.05)})`;
            section.style.opacity = `${1 - (scrollRatio * 0.5)}`; // Exemplo de desvanecimento sutil
            // will-change otimiza a performance
            section.style.willChange = 'transform, opacity';
        });
    }

    // Chama a função ao rolar e no carregamento
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallaxSections); // Otimização para animações
    });
    requestAnimationFrame(updateParallaxSections); // Chamada inicial

    // --------------------------------------------------------------------
    // 3. Scroll Reveal Aprimorado (Mantido)
    // --------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);
                observer.unobserve(element); 
            }
        });
    }, observerOptions);
    revealElements.forEach(element => {
        observer.observe(element);
    });
    
    // --------------------------------------------------------------------
    // 4. Efeito de Navegação Suave (Scroll Suave) (Mantido)
    // --------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --------------------------------------------------------------------
    // 5. Lógica de Formulário de Contato com Formspree (Mantido)
    // --------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            formMessage.textContent = 'Enviando...';
            formMessage.style.color = 'var(--primary-color)';

            const response = await fetch(e.target.action, {
                method: 'POST',
                body: new FormData(e.target),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formMessage.textContent = 'Obrigada! Sua mensagem foi enviada com sucesso.';
                formMessage.style.color = 'green';
                contactForm.reset();
            } else {
                formMessage.textContent = 'Ocorreu um erro ao enviar. Por favor, tente novamente mais tarde ou envie um email diretamente.';
                formMessage.style.color = 'red';
            }
            
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }

    // --------------------------------------------------------------------
    // 6. Efeito na Navbar (Cor e Estilo ao rolar) (Mantido)
    // --------------------------------------------------------------------
    // Já corrigido na interação anterior.
    // Certifique-se de que a variável `navbarHeight` está acessível ou declarada no escopo correto.
    // Se a navbarHeight ainda der problema, declare-a globalmente ou passe como parâmetro.
    // Por enquanto, ela já está sendo acessada no início do DOMContentLoaded.
    
    // Calcula a altura onde a mudança deve ocorrer. Se a seção home existir,
    // usamos sua altura. Caso contrário, usamos um valor padrão.
    let scrollThreshold = 100; // Valor padrão
    if (heroSection) {
        // Pega a altura da navbar para um cálculo preciso
        // const navbarHeight = navbar.offsetHeight; // Já declarada no topo do DOMContentLoaded
        scrollThreshold = heroSection.offsetHeight - (navbarHeight + 50);
    }

    const updateNavbarStyle = () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateNavbarStyle);
    updateNavbarStyle(); // Chama ao carregar a página para o estado inicial


    // --------------------------------------------------------------------
    // 7. Efeito de Digitação no Nome (Mantido)
    // --------------------------------------------------------------------
    const typingElement = document.getElementById('typing-name');
    const textToType = "Laura Pirolli Furlin";
    let charIndex = 0;
    let isTyping = false; 

    function typeWriter() {
        if (!typingElement || isTyping) return;

        isTyping = true;
        typingElement.innerHTML = ''; 
        typingElement.classList.add('code-font'); 
        typingElement.style.color = 'var(--text-light)'; 

        const typeChar = () => {
            if (charIndex < textToType.length) {
                typingElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 100); 
            } else {
                typingElement.innerHTML += '<span class="cursor">|</span>';
            }
        };
        typeChar();
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                heroObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 }); 

    if (heroSection) {
        heroObserver.observe(heroSection);
    }
});