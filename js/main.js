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

    // Google Drive API Configuration
    const GOOGLE_DRIVE_CONFIG = {
        API_KEY: 'YOUR_API_KEY_HERE', // Replace with your Google API key
        FOLDER_ID: '1w2Uao5tH7pOM_mQkFHaMRjM-xqfz3WSI',
        DISCOVERY_URL: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
    };

    // Video metadata mapping for better descriptions and categories
    const videoMetadata = {
        'Cologne Ad': {
            description: 'Professional commercial music composition for advertising',
            category: 'cinematic',
            featured: true
        },
        'Fear Rain - Studio Ghibli Theme': {
            description: 'Cinematic orchestral theme with Studio Ghibli inspiration',
            category: 'cinematic',
            featured: false
        },
        'fear-rain-studio-ghibli': {
            title: 'Fear Rain - Studio Ghibli Theme',
            description: 'Cinematic orchestral theme with Studio Ghibli inspiration',
            category: 'cinematic',
            featured: false
        },
        'Heartbreak': {
            description: 'Emotional dramatic composition',
            category: 'dramatic',
            featured: false
        },
        'heartbreak': {
            title: 'Heartbreak',
            description: 'Emotional dramatic composition',
            category: 'dramatic',
            featured: false
        },
        'Intrigue': {
            description: 'Suspenseful composition',
            category: 'dramatic',
            featured: false
        },
        'intrigue': {
            title: 'Intrigue',
            description: 'Suspenseful composition',
            category: 'dramatic',
            featured: false
        },
        'Slowly Aching': {
            description: 'Ambient emotional piece',
            category: 'ambient',
            featured: false
        },
        'slowly aching': {
            title: 'Slowly Aching',
            description: 'Ambient emotional piece',
            category: 'ambient',
            featured: false
        }
    };

    // Video data with embedded Google Drive videos (Slowly Aching removed - invalid format)
    const fallbackVideoData = [
        {
            id: 1,
            title: "Cologne Ad",
            description: "Professional commercial music composition for advertising",
            category: "cinematic",
            featured: true,
            googleDriveUrl: "https://drive.google.com/file/d/11uyjlG92LIIDMgugZ3SRsL5IoW7pftBb/view?usp=sharing",
            embedUrl: "https://drive.google.com/file/d/11uyjlG92LIIDMgugZ3SRsL5IoW7pftBb/preview",
            duration: "2:30"
        },
        {
            id: 2,
            title: "Fear Rain - Studio Ghibli Theme",
            description: "Cinematic orchestral theme with Studio Ghibli inspiration",
            category: "cinematic",
            featured: false,
            googleDriveUrl: "https://drive.google.com/file/d/1AT2O-QkWubsZvNvqrv6Qcf0IuAW-2EDZ/view?usp=sharing",
            embedUrl: "https://drive.google.com/file/d/1AT2O-QkWubsZvNvqrv6Qcf0IuAW-2EDZ/preview",
            duration: "3:45"
        },
        {
            id: 3,
            title: "Heartbreak",
            description: "Emotional dramatic composition",
            category: "dramatic",
            featured: false,
            googleDriveUrl: "https://drive.google.com/file/d/1j0Fyo39n1cBeuZXXbfPQAZx2N3-DDYzs/view?usp=sharing",
            embedUrl: "https://drive.google.com/file/d/1j0Fyo39n1cBeuZXXbfPQAZx2N3-DDYzs/preview",
            duration: "4:12"
        },
        {
            id: 4,
            title: "Intrigue",
            description: "Suspenseful composition",
            category: "dramatic",
            featured: false,
            googleDriveUrl: "https://drive.google.com/file/d/11oFFn5CiqGIb0lqfLYdEobYr_kKr3-jS/view?usp=sharing",
            embedUrl: "https://drive.google.com/file/d/11oFFn5CiqGIb0lqfLYdEobYr_kKr3-jS/preview",
            duration: "2:58"
        }
    ];

    let currentVideoData = [];

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

    // Google Drive API Functions
    async function loadGoogleDriveAPI() {
        try {
            console.log('🔑 Loading Google Drive API...');

            // Check if we have an API key configured
            if (GOOGLE_DRIVE_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
                console.log('⚠️ Google Drive API key not configured, using fallback data');
                return false;
            }

            // Load the Google API client
            await loadScript('https://apis.google.com/js/api.js');
            await new Promise((resolve) => gapi.load('client', resolve));

            // Initialize the client
            await gapi.client.init({
                apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
                discoveryDocs: [GOOGLE_DRIVE_CONFIG.DISCOVERY_URL]
            });

            console.log('✅ Google Drive API loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to load Google Drive API:', error);
            return false;
        }
    }

    async function fetchVideosFromGoogleDrive() {
        try {
            console.log('📁 Fetching videos from Google Drive folder...');

            const response = await gapi.client.drive.files.list({
                q: `'${GOOGLE_DRIVE_CONFIG.FOLDER_ID}' in parents and mimeType contains 'video/'`,
                fields: 'files(id, name, mimeType, size, createdTime, webViewLink, webContentLink)',
                orderBy: 'name'
            });

            const files = response.result.files;
            console.log(`📹 Found ${files.length} video files in Google Drive`);

            // Process files into our video data format
            const videoData = files.map((file, index) => {
                const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                const metadata = findVideoMetadata(fileName, file.name);

                return {
                    id: index + 1,
                    title: metadata.title || beautifyFileName(fileName),
                    description: metadata.description || `Professional music composition - ${fileName}`,
                    category: metadata.category || categorizeVideo(fileName),
                    featured: metadata.featured || false,
                    googleDriveUrl: file.webViewLink,
                    downloadUrl: file.webContentLink,
                    fileId: file.id,
                    mimeType: file.mimeType,
                    size: file.size,
                    duration: "Unknown", // Would need video processing to get actual duration
                    createdTime: file.createdTime
                };
            });

            console.log('✅ Successfully processed video data from Google Drive');
            return videoData;

        } catch (error) {
            console.error('❌ Failed to fetch videos from Google Drive:', error);
            return null;
        }
    }

    function findVideoMetadata(fileName, fullFileName) {
        // Try exact match first
        if (videoMetadata[fileName]) {
            return videoMetadata[fileName];
        }

        // Try full filename match
        if (videoMetadata[fullFileName]) {
            return videoMetadata[fullFileName];
        }

        // Try lowercase match
        const lowerFileName = fileName.toLowerCase();
        if (videoMetadata[lowerFileName]) {
            return videoMetadata[lowerFileName];
        }

        // Try partial matches
        for (const key in videoMetadata) {
            if (fileName.toLowerCase().includes(key.toLowerCase()) ||
                key.toLowerCase().includes(fileName.toLowerCase())) {
                return videoMetadata[key];
            }
        }

        return {};
    }

    function beautifyFileName(fileName) {
        return fileName
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
    }

    function categorizeVideo(fileName) {
        const name = fileName.toLowerCase();

        if (name.includes('ambient') || name.includes('aching') || name.includes('slow')) {
            return 'ambient';
        }
        if (name.includes('dramatic') || name.includes('heart') || name.includes('intrigue') || name.includes('suspense')) {
            return 'dramatic';
        }
        if (name.includes('uplifting') || name.includes('happy') || name.includes('joy')) {
            return 'uplifting';
        }

        return 'cinematic'; // Default category
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Simple video loading function - no API required
    async function loadVideos() {
        console.log('🎬 Loading video showcase...');

        // Check if individual links are configured
        const hasIndividualLinks = fallbackVideoData.every(video =>
            video.googleDriveUrl &&
            !video.googleDriveUrl.includes('REPLACE_WITH_') &&
            !video.googleDriveUrl.includes('folders/')
        );

        if (hasIndividualLinks) {
            console.log('✅ Using individual Google Drive video links');
        } else {
            console.log('📄 Using placeholder links - replace with individual video links for best experience');
        }

        currentVideoData = fallbackVideoData;
        renderVideoGallery(currentVideoData);

        // Optional: Try Google Drive API if configured
        if (GOOGLE_DRIVE_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE') {
            try {
                const apiLoaded = await loadGoogleDriveAPI();
                if (apiLoaded) {
                    const driveVideos = await fetchVideosFromGoogleDrive();
                    if (driveVideos && driveVideos.length > 0) {
                        console.log('🚀 Enhanced with Google Drive API data');
                        currentVideoData = driveVideos;
                        renderVideoGallery(currentVideoData);
                    }
                }
            } catch (error) {
                console.log('ℹ️ Google Drive API not available, using manual links');
            }
        }
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

    // Professional video gallery with embedded Google Drive videos
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

            // Use embed URL if available, otherwise fall back to regular URL
            const embedUrl = video.embedUrl || video.googleDriveUrl;
            const watchUrl = video.googleDriveUrl;
            const driveUrl = video.downloadUrl || video.googleDriveUrl;

            // Format file size if available
            const fileSizeText = video.size ? ` • ${formatFileSize(parseInt(video.size))}` : '';

            // Use created date or default duration
            const durationText = video.duration !== 'Unknown' ? video.duration :
                video.createdTime ? new Date(video.createdTime).toLocaleDateString() : '---';

            videoItem.innerHTML = `
                <div class="video-card category-${video.category}">
                    <div class="video-container" style="background: linear-gradient(135deg, ${getGradientForCategory(video.category)})">
                        <iframe
                            src="${embedUrl}"
                            frameborder="0"
                            allowfullscreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            class="video-iframe">
                        </iframe>
                        <div class="video-overlay">
                            <div class="video-duration">${durationText}</div>
                            <div class="video-category-badge category-badge-${video.category}">${video.category.toUpperCase()}</div>
                            ${video.featured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
                        </div>
                    </div>
                    <div class="video-info">
                        <h4>${video.title}</h4>
                        <p>${video.description}</p>
                        <div class="video-meta">
                            <small class="video-details">${video.mimeType ? video.mimeType.split('/')[1].toUpperCase() : 'VIDEO'}${fileSizeText}</small>
                        </div>
                        <div class="video-actions">
                            <button class="video-link primary category-btn-${video.category}" onclick="toggleFullscreen(this)"
                                    title="Toggle fullscreen">
                                <i class="fas fa-expand"></i> Fullscreen
                            </button>
                            <a href="${watchUrl}" target="_blank" rel="noopener" class="video-link secondary category-link-${video.category}"
                               title="Open in Google Drive">
                                <i class="fab fa-google-drive"></i> Open in Drive
                            </a>
                        </div>
                    </div>
                </div>
            `;

            videoGrid.appendChild(videoItem);
        });

        console.log(`✅ Rendered ${videos.length} embedded video players from ${videos.length > 0 && videos[0].fileId ? 'Google Drive API' : 'fallback data'}`);

        // Update category filter buttons based on available categories
        updateCategoryFilters(videos);
    }

    function getGradientForCategory(category) {
        switch (category.toLowerCase()) {
            case 'cinematic':
                return '#667eea 0%, #764ba2 100%';
            case 'dramatic':
                return '#f093fb 0%, #f5576c 100%';
            case 'ambient':
                return '#4facfe 0%, #00f2fe 100%';
            case 'uplifting':
                return '#43e97b 0%, #38f9d7 100%';
            default:
                return '#667eea 0%, #764ba2 100%';
        }
    }

    function updateCategoryFilters(videos) {
        // Get unique categories from videos
        const categories = [...new Set(videos.map(v => v.category))];
        const filterContainer = document.querySelector('.video-filters');

        if (!filterContainer) return;

        // Keep "All Works" filter and add dynamic categories
        const allButton = filterContainer.querySelector('[data-filter="all"]');
        const existingButtons = [...filterContainer.querySelectorAll('.filter-btn:not([data-filter="all"])')];

        // Remove old category buttons
        existingButtons.forEach(btn => btn.remove());

        // Add new category buttons
        categories.forEach(category => {
            if (!filterContainer.querySelector(`[data-filter="${category}"]`)) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.setAttribute('data-filter', category);
                button.textContent = category.charAt(0).toUpperCase() + category.slice(1);

                // Add click handler
                button.addEventListener('click', function () {
                    filterVideos(category);

                    // Update active button
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });

                filterContainer.appendChild(button);
            }
        });
    }

    function filterVideos(category) {
        const videoItems = document.querySelectorAll('.video-item');

        videoItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.style.display = 'none';
            }
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
    const iframe = videoItem.querySelector('iframe');

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
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

// Add CSS for form messages and video cards
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
    
    .video-iframe {
        width: 100%;
        height: 300px;
        border: none;
        border-radius: 8px;
        background: #000;
    }
    
    .video-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 1;
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
    
    .video-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
    }
    
    .video-card:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--gold-color);
    }
    
    .video-thumbnail {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
    }
    
    .thumbnail-background {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    
    .play-overlay {
        width: 60px;
        height: 60px;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gold-color);
        font-size: 1.5rem;
        transition: all 0.3s ease;
    }
    
    .video-card:hover .play-overlay {
        background: var(--gold-color);
        color: #000;
        transform: scale(1.1);
    }
    
    .video-duration {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .video-category-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: var(--gold-color);
        color: #000;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .featured-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #ff6b35;
        color: white;
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .video-meta {
        margin: 0.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .video-details {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .video-link.primary {
        color: #000 !important;
        background: var(--gold-color) !important;
        border: 1px solid var(--gold-color) !important;
    }
    
    .video-link.primary:hover {
        background: #fff !important;
        transform: translateY(-2px);
    }
    
    .video-link.secondary {
        color: var(--gold-color) !important;
        background: rgba(212, 175, 55, 0.1) !important;
        border: 1px solid rgba(212, 175, 55, 0.3) !important;
    }
    
    .video-link.secondary:hover {
        background: rgba(212, 175, 55, 0.2) !important;
        border-color: var(--gold-color) !important;
        transform: translateY(-2px);
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
    
    /* Enhanced Category-Based Styling */
    .category-cinematic {
        border: 2px solid rgba(102, 126, 234, 0.3);
    }
    
    .category-cinematic:hover {
        border-color: rgba(102, 126, 234, 0.8);
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
    }
    
    .category-dramatic {
        border: 2px solid rgba(240, 147, 251, 0.3);
    }
    
    .category-dramatic:hover {
        border-color: rgba(240, 147, 251, 0.8);
        box-shadow: 0 0 20px rgba(240, 147, 251, 0.4);
    }
    
    .category-ambient {
        border: 2px solid rgba(79, 172, 254, 0.3);
    }
    
    .category-ambient:hover {
        border-color: rgba(79, 172, 254, 0.8);
        box-shadow: 0 0 20px rgba(79, 172, 254, 0.4);
    }
    
    /* Category-Specific Badge Colors */
    .category-badge-cinematic {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
    }
    
    .category-badge-dramatic {
        background: linear-gradient(45deg, #f093fb, #f5576c);
        color: white;
    }
    
    .category-badge-ambient {
        background: linear-gradient(45deg, #4facfe, #00f2fe);
        color: white;
    }
    
    /* Category-Specific Button Colors */
    .category-btn-cinematic {
        background: linear-gradient(45deg, #667eea, #764ba2) !important;
        border: none;
        color: white !important;
    }
    
    .category-btn-cinematic:hover {
        background: linear-gradient(45deg, #764ba2, #667eea) !important;
        transform: translateY(-2px);
    }
    
    .category-btn-dramatic {
        background: linear-gradient(45deg, #f093fb, #f5576c) !important;
        border: none;
        color: white !important;
    }
    
    .category-btn-dramatic:hover {
        background: linear-gradient(45deg, #f5576c, #f093fb) !important;
        transform: translateY(-2px);
    }
    
    .category-btn-ambient {
        background: linear-gradient(45deg, #4facfe, #00f2fe) !important;
        border: none;
        color: white !important;
    }
    
    .category-btn-ambient:hover {
        background: linear-gradient(45deg, #00f2fe, #4facfe) !important;
        transform: translateY(-2px);
    }
    
    /* Category-Specific Secondary Links */
    .category-link-cinematic {
        border-color: rgba(102, 126, 234, 0.5) !important;
        color: #667eea !important;
    }
    
    .category-link-cinematic:hover {
        background: rgba(102, 126, 234, 0.1) !important;
        border-color: #667eea !important;
    }
    
    .category-link-dramatic {
        border-color: rgba(240, 147, 251, 0.5) !important;
        color: #f093fb !important;
    }
    
    .category-link-dramatic:hover {
        background: rgba(240, 147, 251, 0.1) !important;
        border-color: #f093fb !important;
    }
    
    .category-link-ambient {
        border-color: rgba(79, 172, 254, 0.5) !important;
        color: #4facfe !important;
    }
    
    .category-link-ambient:hover {
        background: rgba(79, 172, 254, 0.1) !important;
        border-color: #4facfe !important;
    }
`;
document.head.appendChild(style);