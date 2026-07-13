/* ============================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// PARTICLE BACKGROUND ANIMATION
// ============================================
class ParticleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 80;
        this.maxDistance = 120;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    createParticles() {
        const count = Math.min(this.particleCount, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.5 ? '0, 212, 255' : '124, 58, 237',
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Movement
            p.x += p.vx;
            p.y += p.vy;

            // Boundary wrapping
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x -= dx * force * 0.02;
                    p.y -= dy * force * 0.02;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.maxDistance) {
                    const opacity = (1 - dist / this.maxDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// TYPING ANIMATION
// ============================================
class TypeWriter {
    constructor(elementId, texts, speed = 80, pause = 2000) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = 40;
        this.pause = pause;
        this.currentText = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const fullText = this.texts[this.currentText];

        if (this.isDeleting) {
            this.currentChar--;
        } else {
            this.currentChar++;
        }

        this.element.textContent = fullText.substring(0, this.currentChar);

        let delay = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.currentChar === fullText.length) {
            delay = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentText = (this.currentText + 1) % this.texts.length;
            delay = 400;
        }

        setTimeout(() => this.type(), delay);
    }
}

// ============================================
// SCROLL ANIMATIONS (Custom AOS)
// ============================================
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        this.observe();
    }

    observe() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.aosDelay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('aos-animate');
                        }, parseInt(delay));
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        this.elements.forEach((el) => observer.observe(el));
    }
}

// ============================================
// SKILL BAR ANIMATION
// ============================================
class SkillBars {
    constructor() {
        this.bars = document.querySelectorAll('.bar-fill');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const width = entry.target.dataset.width;
                        entry.target.style.width = width + '%';
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.bars.forEach((bar) => observer.observe(bar));
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.counters.forEach((counter) => observer.observe(counter));
    }

    animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
            el.textContent = Math.floor(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    }
}

// ============================================
// NAVBAR
// ============================================
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.getElementById('nav-links');
        this.navToggle = document.getElementById('nav-toggle');
        this.links = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section, .hero');
        this.init();
    }

    init() {
        // Scroll handler
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveLink();
        });

        // Mobile toggle
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        // Close on link click
        this.links.forEach((link) => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach((section) => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        this.links.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// CV DOWNLOAD (force direct file save)
// ============================================
class CVDownload {
    constructor(buttonId, fileUrl, fileName) {
        this.button = document.getElementById(buttonId);
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.init();
    }

    init() {
        if (!this.button) return;
        this.button.addEventListener('click', (e) => this.handleClick(e));
    }

    async handleClick(e) {
        e.preventDefault();

        const originalHTML = this.button.innerHTML;
        this.button.classList.add('downloading');

        try {
            const response = await fetch(this.fileUrl);
            if (!response.ok) throw new Error('File not found');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = this.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } catch (err) {
            // Fallback: normal navigation if fetch/blob approach fails
            window.location.href = this.fileUrl;
        } finally {
            this.button.classList.remove('downloading');
            this.button.innerHTML = originalHTML;
        }
    }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.submitBtn.classList.add('loading');

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.submitBtn.classList.remove('loading');

        // Show success feedback
        const originalHTML = this.submitBtn.innerHTML;
        this.submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        this.submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
            this.submitBtn.innerHTML = originalHTML;
            this.submitBtn.style.background = '';
            this.form.reset();
        }, 3000);
    }
}

// ============================================
// CERTIFICATE LIGHTBOX
// ============================================
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('cert-lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Background particles
    new ParticleCanvas('particles-canvas');

    // Typing animation
    new TypeWriter('typed-role', [
        'Network Administrator',
        'System Administrator',
        'Cloud Administrator',
        'Azure Specialist',
        'IoT Developer',
        'IT Help Desk Technician',
    ]);

    // Scroll animations
    new ScrollAnimator();

    // Skill bars
    new SkillBars();

    // Counter animation
    new CounterAnimation();

    // Navbar
    new Navbar();

    // CV Download button
    new CVDownload('download-cv-btn', 'Ahmed_Elsayed_Salah_CV.pdf', 'Ahmed_Elsayed_Salah_CV.pdf');

    // Contact form
    new ContactForm();

    // Lightbox events
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
});
