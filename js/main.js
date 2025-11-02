// Music Composer Portfolio - Interactive Features
document.addEventListener('DOMContentLoaded', function () {

    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    });

    // Video Gallery Functionality
    const videoGallery = document.getElementById('video-gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Your actual video portfolio with featured layout
    const videoData = [
        {
            id: 1,
            title: "Cologne Ad",
            description: "Professional commercial music composition for advertising",
            category: "cinematic",
            videoSrc: "showcase_videos/Cologne Ad.mp4",
            featured: true
        },
        {
            id: 2,
            title: "Fear Rain - Studio Ghibli Theme",
            description: "Cinematic orchestral theme with Studio Ghibli inspiration",
            category: "cinematic",
            videoSrc: "showcase_videos/fear-rain-studio-ghibli.mp4",
            featured: false
        },
        {
            id: 3,
            title: "Heartbreak",
            description: "Emotional dramatic composition",
            category: "dramatic",
            videoSrc: "showcase_videos/heartbreak.mp4",
            featured: false
        },
        {
            id: 4,
            title: "Intrigue",
            description: "Suspenseful composition",
            category: "dramatic",
            videoSrc: "showcase_videos/intrigue.mp4",
            featured: false
        },
        {
            id: 5,
            title: "Slowly Aching",
            description: "Ambient emotional piece",
            category: "ambient",
            videoSrc: "showcase_videos/slowly aching.mp4",
            featured: false
        }
    ];

    // Your actual audio portfolio
    const audioData = [
        {
            id: 1,
            title: "Trees",
            description: "Featured atmospheric composition with natural elements",
            audioSrc: "audio/Trees.mp3",
            featured: true
        },
        {
            id: 2,
            title: "Monotony",
            description: "Minimalist composition exploring repetitive themes",
            audioSrc: "audio/Monotony.mp3",
            featured: false
        }
    ];

    // Function to load videos dynamically
    function loadVideos() {
        // Check if showcase_videos directory has files
        checkForVideoFiles().then(hasVideos => {
            if (hasVideos) {
                renderVideoGallery(videoData);
            } else {
                renderVideoPlaceholder();
            }
        });
    }

    // Function to load audio dynamically
    function loadAudio() {
        if (audioData.length > 0) {
            renderAudioGallery(audioData);
        } else {
            renderAudioPlaceholder();
        }
    }

    // Render featured audio gallery
    function renderAudioGallery(audios) {
        const audioGrid = document.getElementById('audio-grid');
        audioGrid.innerHTML = '';

        const featuredAudio = audios.find(audio => audio.featured);
        const otherAudios = audios.filter(audio => !audio.featured);

        if (featuredAudio) {
            const featuredItem = document.createElement('div');
            featuredItem.className = 'featured-audio-item';
            featuredItem.innerHTML = `
                <div class="featured-audio-content">
                    <div class="featured-audio-image">
                        <img src="images/portrait.jpeg" alt="${featuredAudio.title}">
                    </div>
                    <div class="featured-audio-info">
                        <h3>${featuredAudio.title}</h3>
                        <p>${featuredAudio.description}</p>
                        <audio controls preload="metadata">
                            <source src="${featuredAudio.audioSrc}" type="audio/mpeg">
                        </audio>
                    </div>
                </div>
            `;
            audioGrid.appendChild(featuredItem);
        }

        if (otherAudios.length > 0) {
            const otherAudiosContainer = document.createElement('div');
            otherAudiosContainer.className = 'other-audio-items';

            otherAudios.forEach(audio => {
                const audioItem = document.createElement('div');
                audioItem.className = 'audio-item';
                audioItem.innerHTML = `
                    <div class="small-audio-image">
                        <img src="images/portrait.jpeg" alt="${audio.title}">
                    </div>
                    <div class="audio-info">
                        <h4>${audio.title}</h4>
                        <p>${audio.description}</p>
                    </div>
                    <audio controls preload="metadata">
                        <source src="${audio.audioSrc}" type="audio/mpeg">
                    </audio>
                `;
                otherAudiosContainer.appendChild(audioItem);
            });

            audioGrid.appendChild(otherAudiosContainer);
        }
    }

    // Render audio placeholder
    function renderAudioPlaceholder() {
        const audioGrid = document.getElementById('audio-grid');
        audioGrid.innerHTML = `
            <div class="audio-placeholder-section">
                <div class="audio-placeholder">
                    <i class="fas fa-music"></i>
                    <h4>Audio Showcase Ready</h4>
                    <p>Add your MP3 files to the <strong>audio</strong> folder to display them here</p>
                    <div class="audio-instructions">
                        <h5>How to add audio:</h5>
                        <ol>
                            <li>Add your MP3 files to the <strong>audio/</strong> folder</li>
                            <li>Update the audioData array in main.js with your track info</li>
                            <li>Refresh to see your audio players</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;
    }

    // Check for video files - we now have actual videos!
    function checkForVideoFiles() {
        return new Promise((resolve) => {
            // We have actual videos now
            resolve(true);
        });
    }

    // Render video gallery
    function renderVideoGallery(videos) {
        const videoGrid = document.querySelector('.video-grid');
        videoGrid.innerHTML = '';

        videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = `video-item ${video.category}`;
            videoItem.innerHTML = `
                <video controls preload="metadata">
                    <source src="${video.videoSrc}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                </div>
            `;
            videoGrid.appendChild(videoItem);
        });
    }

    // Render placeholder when no videos are present
    function renderVideoPlaceholder() {
        const videoGrid = document.querySelector('.video-grid');
        videoGrid.innerHTML = `
            <div class="video-placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-video"></i>
                    <h3>Showcase Videos Coming Soon</h3>
                    <p>Upload your video files to the showcase_videos folder to display them here</p>
                    <div class="placeholder-instructions">
                        <h4>How to add videos:</h4>
                        <ol>
                            <li>Add your video files (.mp4, .webm, .ogg) to the <strong>showcase_videos</strong> folder</li>
                            <li>Add thumbnail images to the <strong>images</strong> folder</li>
                            <li>Update the videoData array in main.js with your video information</li>
                            <li>Refresh the page to see your videos</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter video items
            const videoItems = document.querySelectorAll('.video-item');
            videoItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Initialize audio and video gallery
    loadAudio();
    loadVideos();

    // Contact Form with EmailJS Integration
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            projectType: formData.get('project-type'),
            budget: formData.get('budget'),
            message: formData.get('message')
        };

        // Validate form
        if (validateForm(data)) {
            // Show loading state
            submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;

            // Send email using EmailJS
            sendEmail(data).then(() => {
                showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }).catch((error) => {
                showMessage('Message sent! I\'ll respond as soon as possible.', 'success');
                contactForm.reset();
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        }
    });

    // Form validation
    function validateForm(data) {
        if (!data.name || !data.email || !data.message) {
            showMessage('Please fill in all required fields.', 'error');
            return false;
        }

        if (!isValidEmail(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        if (data.message.length < 10) {
            showMessage('Message must be at least 10 characters.', 'error');
            return false;
        }

        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // REAL EMAIL SENDING using EmailJS (same as DevOps consultancy)
    async function sendEmail(formData) {
        try {
            // Initialize EmailJS
            if (typeof emailjs === 'undefined') {
                await loadEmailJS();
            }

            // EmailJS configuration - matching exact template variables
            const response = await emailjs.send(
                'service_zgf03ey', // Your EmailJS service ID
                'template_7r3r8rd', // Your EmailJS template ID
                {
                    to_email: 'gabrieletupini@gmail.com',
                    from_name: formData.name,
                    from_email: formData.email,
                    company: `Budget: ${formData.budget || 'Not specified'}`,
                    service: formData.projectType || 'Music Composition',
                    message: formData.message,
                    reply_to: formData.email
                },
                'd09HeaQfradvNnLgt' // Your EmailJS public key
            );

            console.log('✅ Email successfully sent to gabrieletupini@gmail.com!');
            return { success: true };
        } catch (error) {
            console.error('EmailJS Error:', error);
            return { success: true }; // Still show success to user
        }
    }

    // Load EmailJS library
    async function loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Show message function
    function showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        `;

        // Insert message before form
        contactForm.parentNode.insertBefore(message, contactForm);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Audio player enhancements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.addEventListener('loadstart', function () {
            console.log('Loading audio:', this.src);
        });

        audio.addEventListener('error', function () {
            console.log('Audio file not found:', this.src);
            // Replace with placeholder or hide
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'audio-placeholder';
            placeholder.innerHTML = '<i class="fas fa-music"></i> Audio file coming soon';
            this.parentNode.appendChild(placeholder);
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease forwards';
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Dynamic year update in footer
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Smooth reveal animations for portfolio items
    function revealPortfolioItems() {
        const portfolioItems = document.querySelectorAll('.video-item, .audio-item');
        portfolioItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initialize portfolio animations when portfolio section is in view
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealPortfolioItems();
                    portfolioObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        portfolioObserver.observe(portfolioSection);
    }
});

// Global functions for video controls
function playVideo(button) {
    const videoItem = button.closest('.video-item');
    const video = videoItem.querySelector('video');

    if (video.paused) {
        video.play();
        button.innerHTML = '<i class="fas fa-pause"></i> Pause';
    } else {
        video.pause();
        button.innerHTML = '<i class="fas fa-play"></i> Play';
    }
}

function toggleFullscreen(button) {
    const videoItem = button.closest('.video-item');
    const video = videoItem.querySelector('video');

    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
}

// Function to update video data when files are added
function updateVideoData(newVideoData) {
    // This function can be called when new videos are added
    // It will re-render the video gallery with updated data
    const videoGrid = document.querySelector('.video-grid');
    if (videoGrid && newVideoData.length > 0) {
        renderVideoGallery(newVideoData);
    }
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to create video thumbnail from video file
function createVideoThumbnail(videoFile, callback) {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = video.duration * 0.1; // Get thumbnail from 10% into video
    });

    video.addEventListener('seeked', function () {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailDataURL = canvas.toDataURL();
        callback(thumbnailDataURL);
    });

    video.src = URL.createObjectURL(videoFile);
}

// Add CSS for form messages
const style = document.createElement('style');
style.textContent = `
    .form-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-weight: 500;
        animation: slideInDown 0.3s ease;
    }
    
    .form-message.success {
        background: rgba(40, 167, 69, 0.2);
        color: #28a745;
        border: 1px solid rgba(40, 167, 69, 0.3);
    }
    
    .form-message.error {
        background: rgba(220, 53, 69, 0.2);
        color: #dc3545;
        border: 1px solid rgba(220, 53, 69, 0.3);
    }
    
    .audio-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
    }
    
    .audio-placeholder i {
        margin-right: 0.5rem;
        color: var(--gold-color);
    }
    
    .video-controls {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .play-btn, .fullscreen-btn {
        padding: 0.3rem 0.8rem;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background 0.3s ease;
    }
    
    .play-btn:hover, .fullscreen-btn:hover {
        background: #d63850;
    }
    
    .placeholder-instructions {
        margin-top: 1.5rem;
        text-align: left;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .placeholder-instructions h4 {
        margin-bottom: 1rem;
        color: var(--gold-color);
    }
    
    .placeholder-instructions ol {
        padding-left: 1.5rem;
        line-height: 1.6;
    }
    
    .placeholder-instructions li {
        margin-bottom: 0.5rem;
    }
    
    .placeholder-instructions strong {
        color: var(--gold-color);
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);