document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Trigger once on load
    revealOnScroll();
    
    // Trigger on scroll
    window.addEventListener('scroll', revealOnScroll);

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Modal Logic for Attractions
    const modal = document.getElementById('attraction-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-btn');
    const modalTriggers = document.querySelectorAll('.modal-trigger, .card-overlay a');

    // Open modal on click
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // If overlay link is clicked, find the closest card-content for data
            const dataElement = trigger.classList.contains('modal-trigger') 
                ? trigger 
                : trigger.closest('.card').querySelector('.modal-trigger');
                
            if (dataElement) {
                const title = dataElement.getAttribute('data-title');
                const desc = dataElement.getAttribute('data-desc');
                const img = dataElement.getAttribute('data-img');
                
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                if(modalImg && img) {
                    modalImg.src = img;
                    modalImg.alt = title;
                }
                
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore background scrolling
    };

    // Close on X button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // 6. Restaurant Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const restaurantCards = document.querySelectorAll('.restaurant-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            restaurantCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                }
            });
        });
    });
    // 8. Section Background Slideshows
    const sectionsWithImages = document.querySelectorAll('.section[data-images]');
    
    sectionsWithImages.forEach(section => {
        try {
            const images = JSON.parse(section.getAttribute('data-images'));
            if (images && images.length > 0) {
                // Create slideshow container
                const slideshowContainer = document.createElement('div');
                slideshowContainer.className = 'bg-slideshow';
                
                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'section-overlay';
                
                // Create slides
                const slides = [];
                images.forEach((imgUrl, index) => {
                    const slide = document.createElement('div');
                    slide.className = 'bg-slide';
                    if (index === 0) slide.classList.add('active');
                    slide.style.backgroundImage = `url('${imgUrl}')`;
                    slideshowContainer.appendChild(slide);
                    slides.push(slide);
                });
                
                // Prepend to section
                section.insertBefore(overlay, section.firstChild);
                section.insertBefore(slideshowContainer, section.firstChild);
                
                // Set interval for fading
                let currentIndex = 0;
                setInterval(() => {
                    slides[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % slides.length;
                    slides[currentIndex].classList.add('active');
                }, 3000); // 3 seconds
            }
        } catch (e) {
            console.error('Error parsing data-images for section:', section.id, e);
        }
    });
});
