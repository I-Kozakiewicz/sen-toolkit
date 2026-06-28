document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active'); 
        });
    }

    // 2. Sticky Header (Shadow after 50px)
    const header = document.querySelector('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Listen to scroll and run once on load
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 3. Smooth Scrolling for Navigation Links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if it is open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }

                // Calculate offset for sticky header
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Fade-in Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. Highlight Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    
    const highlightNav = () => {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Offset accounts for sticky header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active-link');
                    // Add an active class to the link, or directly modify its style
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.style.color = 'var(--clr-sage-dark)'; // Using the CSS variable
                        link.style.fontWeight = '600';
                    } else {
                        link.style.color = '';
                        link.style.fontWeight = '';
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav);

    // 6. Animate Buttons slightly on hover and click (Vanilla JS addition to CSS)
    const buttons = document.querySelectorAll('.btn, .submit-btn');
    
    buttons.forEach(button => {
        // Click shrink effect
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        // Return to normal
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.02)'; // Matches CSS hover state
        });
        
        // Reset if mouse leaves while clicking
        button.addEventListener('mouseleave', () => {
            button.style.transform = ''; 
        });
    });

    // 7. FAQ Accordion Logic (Matches HTML structure)
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Close all other accordions
            accordionBtns.forEach(otherBtn => {
                if (otherBtn !== this) {
                    otherBtn.classList.remove('active');
                    otherBtn.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current accordion
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});