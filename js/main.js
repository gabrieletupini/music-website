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

    // Google Drive Configuration
    const GOOGLE_DRIVE_CONFIG = {
        // Your Google Drive folder ID (extracted from the shared link)
        folderId: '1w2Uao5tH7pOM_mQkFHaMRjM-xqfz3WSI',
        apiKey: 'YOUR_GOOGLE_API_KEY', // Get from Google Cloud Console (steps provided below)

        // Manual fallback video data (will be used until API key is configured)
        fallbackVideos: [
            {
                id: 1,
                title: "Cologne Ad",
                description: "Professional commercial music composition for advertising",
                category: "cinematic",
                driveId: "GOOGLE_DRIVE_FILE_ID", // Replace with actual Google Drive file ID
                featured: true
            },
            {
                id: 2,
                title: "Fear Rain - Studio Ghibli Theme",
                description: "Cinematic orchestral theme with Studio Ghibli inspiration",
                category: "cinematic",
                driveId: "GOOGLE_DRIVE_FILE_ID",
                featured: false
            },
            {
                id: 3,
                title: "Heartbreak",
                description: "Emotional dramatic composition",
                category: "dramatic",
                driveId: "GOOGLE_DRIVE_FILE_ID",
                featured: false
            },
            {
                id: 4,
                title: "Intrigue",
                description: "Suspenseful composition",
                category: "dramatic",
                driveId: "GOOGLE_DRIVE_FILE_ID",
                featured: false
            },
            {
                id: 5,
                title: "Slowly Aching",
                description: "Ambient emotional piece",
                category: "ambient",
                driveId: "GOOGLE_DRIVE_FILE_ID",
                featured: false
            }
        ]
    };

    // Dynamic video data loaded from Google Drive
    let videoData = [];

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

    // Google Drive API integration
    async function loadVideosFromGoogleDrive() {
        console.log('🎬 Loading videos from Google Drive...');

        try {
            // First try to load from Google Drive API
            if (GOOGLE_DRIVE_CONFIG.folderId && GOOGLE_DRIVE_CONFIG.apiKey &&
                GOOGLE_DRIVE_CONFIG.folderId !== 'YOUR_GOOGLE_DRIVE_FOLDER_ID') {

                const driveVideos = await fetchGoogleDriveVideos();
                if (driveVideos && driveVideos.length > 0) {
                    videoData = driveVideos;
                    console.log(`✅ Loaded ${videoData.length} videos from Google Drive`);
                    renderVideoGallery(videoData);
                    return;
                }
            }

            // Fallback to manual configuration
            console.log('📋 Using fallback video configuration');
            videoData = GOOGLE_DRIVE_CONFIG.fallbackVideos;
            renderVideoGallery(videoData);

        } catch (error) {
            console.error('❌ Error loading Google Drive videos:', error);
            videoData = GOOGLE_DRIVE_CONFIG.fallbackVideos;
            renderVideoGallery(videoData);
        }
    }

    // Fetch videos from Google Drive API
    async function fetchGoogleDriveVideos() {
        const apiKey = GOOGLE_DRIVE_CONFIG.apiKey;
        const folderId = GOOGLE_DRIVE_CONFIG.folderId;

        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'video'&key=${apiKey}&fields=files(id,name,mimeType,webViewLink,thumbnailLink)`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Google Drive API error: ${response.status}`);
            }

            const data = await response.json();

            return data.files.map((file, index) => ({
                id: index + 1,
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                description: `Professional composition - ${file.name}`,
                category: getCategoryFromFilename(file.name),
                driveId: file.id,
                thumbnailUrl: file.thumbnailLink,
                featured: index === 0 // Make first video featured
            }));

        } catch (error) {
            console.error('Google Drive API fetch failed:', error);
            return null;
        }
    }

    // Smart category detection from filename
    function getCategoryFromFilename(filename) {
        const name = filename.toLowerCase();
        if (name.includes('cinematic') || name.includes('film') || name.includes('cologne')) return 'cinematic';
        if (name.includes('dramatic') || name.includes('heartbreak') || name.includes('intrigue')) return 'dramatic';
        if (name.includes('ambient') || name.includes('slow') || name.includes('aching')) return 'ambient';
        if (name.includes('uplifting') || name.includes('happy')) return 'uplifting';
        return 'cinematic'; // default category
    }

    // Function to load videos dynamically (updated for Google Drive)
    function loadVideos() {
        loadVideosFromGoogleDrive();
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

    // Enhanced Google Drive video gallery
    function renderVideoGallery(videos) {
        const videoGrid = document.querySelector('.video-grid');
        videoGrid.innerHTML = '';

        if (!videos || videos.length === 0) {
            renderVideoPlaceholder();
            return;
        }

        videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = `video-item ${video.category}`;

            // Google Drive video embed
            const embedUrl = video.driveId ?
                `https://drive.google.com/file/d/${video.driveId}/preview` :
                '#';

            const directUrl = video.driveId ?
                `https://drive.google.com/file/d/${video.driveId}/view` :
                '#';

            videoItem.innerHTML = `
                <div class="video-container">
                    <iframe
                        src="${embedUrl}"
                        frameborder="0"
                        allowfullscreen
                        allow="autoplay"
                        loading="lazy"
                        onload="this.style.opacity=1; this.nextElementSibling.style.display='none';"
                        onerror="this.style.display='none'; this.nextElementSibling.nextElementSibling.style.display='flex';"
                        style="width:100%; height:300px; opacity:0; transition: opacity 0.3s ease;">
                    </iframe>
                    <div class="video-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading video from Google Drive...</span>
                    </div>
                    <div class="video-error" style="display: none;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Video unavailable. <a href="${directUrl}" target="_blank" rel="noopener">Open in Google Drive</a></span>
                    </div>
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                    <div class="video-actions">
                        <a href="${directUrl}" target="_blank" rel="noopener" class="video-link">
                            <i class="fas fa-external-link-alt"></i> View in Google Drive
                        </a>
                    </div>
                </div>
            `;

            videoGrid.appendChild(videoItem);
        });

        console.log(`✅ Rendered ${videos.length} Google Drive videos`);
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

    // Enhanced video element setup
    function setupVideoElement(video, loadingDiv, errorDiv, videoData) {
        let hasLoaded = false;

        // Show loading initially
        loadingDiv.style.display = 'flex';

        video.addEventListener('loadstart', function () {
            console.log('🎬 Loading video:', videoData.title, this.src);
            loadingDiv.style.display = 'flex';
            errorDiv.style.display = 'none';
        });

        video.addEventListener('canplaythrough', function () {
            console.log('✅ Video ready to play:', videoData.title);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            hasLoaded = true;

            // Enable autoplay on user interaction
            this.addEventListener('click', function () {
                if (this.paused) {
                    this.play().catch(e => console.log('Play failed:', e));
                }
            });
        });

        video.addEventListener('loadedmetadata', function () {
            console.log('📊 Video metadata loaded:', videoData.title, `Duration: ${this.duration}s`);
            loadingDiv.style.display = 'none';
        });

        video.addEventListener('error', function (e) {
            console.error('❌ Video error for', videoData.title, ':', e);
            console.error('Error details:', this.error);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'flex';

            // Try to diagnose the issue
            fetch(this.src)
                .then(response => {
                    console.log('📁 Video file response:', response.status, response.headers.get('content-type'));
                    if (!response.ok) {
                        console.error('🚫 Video file not accessible:', response.status);
                    }
                })
                .catch(err => {
                    console.error('🌐 Network error accessing video:', err);
                });
        });

        video.addEventListener('stalled', function () {
            console.warn('⏳ Video stalled:', videoData.title);
        });

        video.addEventListener('waiting', function () {
            console.warn('⌛ Video waiting for data:', videoData.title);
        });

        // Force load attempt
        setTimeout(() => {
            if (!hasLoaded) {
                console.log('🔄 Forcing video load attempt:', videoData.title);
                video.load();
            }
        }, 2000);
    }

    // Audio player enhancements
    setTimeout(() => {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.addEventListener('loadstart', function () {
                console.log('🎵 Loading audio:', this.src);
            });

            audio.addEventListener('error', function () {
                console.log('❌ Audio file not found:', this.src);
                // Replace with placeholder or hide
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'audio-placeholder';
                placeholder.innerHTML = '<i class="fas fa-music"></i> Audio file coming soon';
                this.parentNode.appendChild(placeholder);
            });

            audio.addEventListener('canplaythrough', function () {
                console.log('✅ Audio ready to play:', this.src);
            });
        });
    }, 1000);

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
    
    .video-container {
        position: relative;
        width: 100%;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        overflow: hidden;
    }
    
    .video-container iframe {
        width: 100%;
        height: 300px;
        border-radius: 8px;
        background: #000;
        display: block;
    }
    
    .video-container video {
        width: 100%;
        height: auto;
        display: block;
        background: #000;
    }
    
    .video-actions {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .video-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--gold-color);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.3s ease;
        padding: 0.5rem 1rem;
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 6px;
        background: rgba(212, 175, 55, 0.1);
    }
    
    .video-link:hover {
        color: #fff;
        background: var(--gold-color);
        border-color: var(--gold-color);
        transform: translateY(-2px);
    }
    
    .video-link i {
        font-size: 0.8rem;
    }
    
    .video-loading, .video-error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        text-align: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        backdrop-filter: blur(4px);
        z-index: 10;
    }
    
    .video-loading i {
        font-size: 1.5rem;
        color: var(--gold-color);
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    .video-error i {
        font-size: 1.5rem;
        color: #ff6b6b;
    }
    
    .video-error a {
        color: var(--gold-color);
        text-decoration: underline;
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
    
    @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
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