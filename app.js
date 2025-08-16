document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans.style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        });
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link Highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${id}"]`);

            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Scroll Event Listeners
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        animateOnScroll();
    });

    // Skill Bar Animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill__progress');
        
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                
                // Animate skill bars when skills section is in view
                if (entry.target.id === 'skills') {
                    setTimeout(animateSkillBars, 500);
                }
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sectionsToObserve = document.querySelectorAll('section');
    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.card, .project__card, .cert__card, .timeline__item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-fade-in-up');
            }
        });
    }

    // âœ… FIXED: Contact Form Handling - Now actually submits to Formspree
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic form validation - only prevent submission if validation fails
            if (!name || !email || !message) {
                e.preventDefault(); // Only prevent if validation fails
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                e.preventDefault(); // Only prevent if validation fails
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // If validation passes, show loading state but let form submit naturally
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Show immediate feedback - form will redirect to Formspree thank you page
            showNotification('Sending your message...', 'info');
            
            // Re-enable button after a short delay (in case of errors)
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 5000);
            
            // Don't prevent default - let the form submit to Formspree!
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = '#39ff14';
                notification.style.color = '#0a0a0a';
                break;
            case 'error':
                notification.style.background = '#ff4444';
                break;
            case 'info':
                notification.style.background = '#00f5ff';
                notification.style.color = '#0a0a0a';
                break;
            default:
                notification.style.background = '#00f5ff';
                notification.style.color = '#0a0a0a';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Download Resume Functionality
    const downloadResumeBtn = document.getElementById('download-resume');
    
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function() {
            // Create resume content
            const resumeContent = generateResumeContent();
            
            // Create and download file
            const blob = new Blob([resumeContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Ayush_Mishra_Resume.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showNotification('Resume downloaded successfully!', 'success');
        });
    }

    // Generate Resume Content
    function generateResumeContent() {
        return `AYUSH MISHRA
Computer Science Student & Web Developer
========================================

CONTACT INFORMATION
Email: Ayushmishra028@outlook.com
Phone: +91-9654885207
LinkedIn: https://www.linkedin.com/in/-ayushmishra-x/

EDUCATION
Bachelor of Technology in Computer Science Engineering
Dr. Abdul Kalam Technical University, Lucknow
Oct 2021 - Jul 2025

Key Coursework:
â€¢ Data Structures and Algorithms
â€¢ Object-Oriented Programming
â€¢ Database Management Systems
â€¢ Operating System
â€¢ Computer Network

EXPERIENCE
McKinsey & Company - Forward Program Learner (May 2025 - Jul 2025)
â€¢ Engaging in global learning initiative focused on leadership and problem-solving
â€¢ Developing strategic thinking through real-world case studies
â€¢ Collaborating with industry leaders

Prodigy Info Technologies - Web Developer Intern (Mar 2024 - Jun 2024)
â€¢ Developed 5+ RESTful APIs using Node.js and MongoDB
â€¢ Achieved 98% code coverage and reduced bugs by 35%
â€¢ Designed 3 APIs for user management

TECHNICAL SKILLS
Programming Languages: C++, Python, JavaScript, SQL
Web Technologies: HTML, CSS, Node.js
Databases: MongoDB, MySQL
Tools: VS Code, GitHub, GIT

PROJECTS
Air Canvas
â€¢ Technologies: OpenCV, MediaPipe, NumPy, Python
â€¢ Gesture-based drawing application using hand tracking
â€¢ Features: Real-time hand detection, color selection, virtual canvas

Online Voting System
â€¢ Technologies: HTML, CSS, JavaScript, Node.js, Python, MongoDB
â€¢ Secure voting platform with authentication
â€¢ Features: Encrypted data handling, vote integrity, real-time results

Weather Cast
â€¢ Technologies: HTML, CSS, JavaScript, OpenWeather API
â€¢ Responsive weather application
â€¢ Features: Current conditions, location-based data, multiple metrics

CERTIFICATIONS
â€¢ McKinsey & Company Forward Program
â€¢ Goldman Sachs Software Engineering Simulation
â€¢ HackerRank Python & SQL certifications
â€¢ Google Developers Student Club
â€¢ C++ Data Structure & Algorithm â€“ E&ICT Academy, IIT Kanpur
â€¢ Machine Learning with Python: Foundations - LinkedIn`;
    }

    // Typing Effect for Hero Title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect for hero title
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add loading animation to cards
    function addLoadingAnimations() {
        const cards = document.querySelectorAll('.project__card, .cert__card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // Initialize loading animations
    setTimeout(addLoadingAnimations, 500);

    // Add hover effects to navigation links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Progress bar animation on scroll
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;

    function checkSkillsInView() {
        if (skillsAnimated) return;
        
        if (skillsSection) {
            const rect = skillsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateSkillBars();
                skillsAnimated = true;
            }
        }
    }

    window.addEventListener('scroll', checkSkillsInView);

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Initialize everything
    updateActiveNavLink();
    checkSkillsInView();
    
    console.log('Portfolio initialized successfully!');
});