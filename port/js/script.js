// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('section');
const themeToggle = document.getElementById('themeToggle');
const sectionTitles = document.querySelectorAll('.section-title');
const animatedElements = document.querySelectorAll('.animate-on-scroll');

// Theme Toggle Functionality
function initTheme() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update the toggle icon
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    updateThemeIcon(newTheme);
});

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active navigation link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Add shadow to navbar on scroll
    if (window.scrollY > 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Project Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Contact Form Handling
const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
contactForm.addEventListener('submit', function(e) {
    // Only validate the form, don't prevent default submission
    let isValid = true;
    formInputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        e.preventDefault(); // Only prevent submission if validation fails
        showFormMessage('Please fill all fields correctly.', 'error');
        return;
    }
    
    // Let the form submit naturally to Formspree
    // No need to prevent default or handle submission with JavaScript
});

// Function to show form messages
function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add form validation
formInputs.forEach(input => {
    input.addEventListener('input', function() {
        validateInput(this);
    });
});

function validateInput(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    
    if (input.validity.valid) {
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    } else {
        if (input.validity.valueMissing) {
            errorElement.textContent = 'This field is required';
        } else if (input.validity.typeMismatch && input.type === 'email') {
            errorElement.textContent = 'Please enter a valid email address';
        }
        input.classList.add('error');
        return false;
    }
}

// Typing Animation for Hero Section
const typingElement = document.querySelector('.hero-text h1 .highlight');
if (typingElement) {
    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing animation when page loads
    window.addEventListener('load', typeWriter);
}

// Animate skill progress bars
const skillItems = document.querySelectorAll('.skill-item');
const animateSkills = () => {
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.progress-bar');
        const skillValue = item.getAttribute('data-skill');
        const elementPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition && !item.classList.contains('animated')) {
            item.classList.add('animated');
            progressBar.style.width = `${skillValue}%`;
            
            // Animate the number
            const valueDisplay = item.querySelector('.progress-value');
            let currentValue = 0;
            const updateValue = () => {
                if (currentValue < skillValue) {
                    currentValue++;
                    valueDisplay.textContent = `${currentValue}%`;
                    requestAnimationFrame(updateValue);
                }
            };
            updateValue();
        }
    });
};

// Add scroll and load event listeners for skill animations
window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

// Remove old skill circle animations
const oldAnimateSkills = document.querySelectorAll('.skill-circle');
if (oldAnimateSkills) {
    oldAnimateSkills.forEach(skill => {
        skill.style.display = 'none';
    });
}

// Animate elements on scroll
const fadeInElements = document.querySelectorAll('.hero-text, .about-image, .about-text, .project-card, .contact-info, .contact-form');

const fadeIn = () => {
    fadeInElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
};

window.addEventListener('scroll', fadeIn);
window.addEventListener('load', fadeIn);

// Animate skill circles on scroll
const skillCircles = document.querySelectorAll('.circle-progress');
const animateSkillsCircles = () => {
    skillCircles.forEach(circle => {
        const value = circle.getAttribute('data-value');
        const offset = 330 - (330 * value) / 100;
        circle.style.setProperty('--offset', offset);
        
        const elementPosition = circle.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            circle.style.animation = 'anim 2s linear forwards';
        }
    });
};

// Counter animation for skill percentages
const animateCounter = (element, target) => {
    let count = 0;
    const speed = 1500 / target; // Reduced from 2000 to 1500 for faster animation
    
    const updateCount = () => {
        if (count < target) {
            count++;
            element.textContent = count + '%';
            requestAnimationFrame(updateCount);
        }
    };
    
    updateCount();
};

// Animate counters when in view
const skillNumbers = document.querySelectorAll('.inner-circle div');
const animateNumbers = () => {
    skillNumbers.forEach(number => {
        const target = parseInt(number.textContent);
        const elementPosition = number.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition && !number.classList.contains('animated')) {
            number.classList.add('animated');
            animateCounter(number, target);
        }
    });
};

window.addEventListener('scroll', () => {
    animateSkillsCircles();
    animateNumbers();
});

window.addEventListener('load', () => {
    animateSkillsCircles();
    animateNumbers();
});

// Scroll Animation
function checkScroll() {
    // Animate section titles
    sectionTitles.forEach(title => {
        const titlePosition = title.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (titlePosition < screenPosition) {
            title.classList.add('animate');
        }
    });
    
    // Animate elements with animate-on-scroll class
    animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
    
    // Animate skill bars
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (itemPosition < screenPosition) {
            const progressBar = item.querySelector('.progress-bar');
            const skillValue = item.getAttribute('data-skill');
            
            if (progressBar && !progressBar.style.width) {
                progressBar.style.width = `${skillValue}%`;
            }
        }
    });
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add animate-on-scroll class to elements that should animate
    document.querySelectorAll('.project-card, .skill-category, .education-item, .certification-item, .core-focus p, .contact-info, .contact-form').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Add staggered animation delay to project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation delay to skill categories
    document.querySelectorAll('.skill-category').forEach((category, index) => {
        category.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation delay to core focus items
    document.querySelectorAll('.core-focus p').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Make all elements visible immediately
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('animate');
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.classList.add('animate');
    });
    
    // Animate skill bars immediately
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.progress-bar');
        const skillValue = item.getAttribute('data-skill');
        
        if (progressBar) {
            progressBar.style.width = `${skillValue}%`;
        }
    });
    
    // Check for elements in view on initial load
    checkScroll();
    
    // Update animated elements when scrolling
    window.addEventListener('scroll', checkScroll);

    // Show skeleton screen initially
    const skeletonScreen = document.getElementById('skeletonScreen');
    
    // Hide skeleton screen after content loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            skeletonScreen.classList.add('skeleton-hidden');
        }, 800); // Add a small delay to ensure everything is rendered
    });
    
    // If page takes too long to load, hide skeleton anyway after 3 seconds
    setTimeout(function() {
        skeletonScreen.classList.add('skeleton-hidden');
    }, 3000);
});

// Modal functionality
const modal = document.getElementById('myModal');
const btn = document.getElementById('openModal');
const span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
} 
