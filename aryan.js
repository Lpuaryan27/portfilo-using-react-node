  // Mobile menu toggle
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
        
        // Typing animation
        const typingTexts = ["Software Developer", "Fullstack Developer"];
        const typingElement = document.querySelector('.typing-animation');
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentText = typingTexts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.length;
                typingSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start typing animation after a short delay
        setTimeout(type, 1000);
        
        // Animate elements when they come into view
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.project-card, .skill-item');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Set initial state for animated elements
        document.querySelectorAll('.project-card, .skill-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Add scroll event listener
        window.addEventListener('scroll', animateOnScroll);
        
        // Trigger once on page load
        animateOnScroll();
        
        // Dark mode toggle
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        const themeIcon = document.getElementById('theme-icon');
        const themeIconMobile = document.getElementById('theme-icon-mobile');
        
        // Check for saved theme preference or use system preference
        function initializeTheme() {
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                document.documentElement.classList.add('dark');
                themeIcon.textContent = '☀️';
                themeIconMobile.textContent = '☀️';
            } else {
                document.documentElement.classList.remove('dark');
                themeIcon.textContent = '🌙';
                themeIconMobile.textContent = '🌙';
            }
        }
        
        // Toggle theme
        function toggleTheme() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                themeIcon.textContent = '🌙';
                themeIconMobile.textContent = '🌙';
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.textContent = '☀️';
                themeIconMobile.textContent = '☀️';
            }
        }
        
        // Event listeners
        themeToggle.addEventListener('click', toggleTheme);
        themeToggleMobile.addEventListener('click', toggleTheme);
        
        // Initialize theme on load
        initializeTheme();
        
        // Watch for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                    themeIcon.textContent = '☀️';
                    themeIconMobile.textContent = '☀️';
                } else {
                    document.documentElement.classList.remove('dark');
                    themeIcon.textContent = '🌙';
                    themeIconMobile.textContent = '🌙';
                }
            }0
        });
        // Additional animation effects on scroll
        document.addEventListener('DOMContentLoaded', () => {
            // Add intersection observer for more animations as user scrolls
            const observerOptions = {
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, observerOptions);
            
            // Elements to observe
            document.querySelectorAll('.intro-title, .intro-subtitle, .intro-description, .iqlipse-link').forEach(el => {
                observer.observe(el);
            });
            
            // Floating shapes animation enhancement
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(shape => {
                shape.addEventListener('mouseover', () => {
                    shape.style.opacity = '0.2';
                });
                
                shape.addEventListener('mouseout', () => {
                    shape.style.opacity = '0.1';
                });
            });
        });