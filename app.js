document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       MOBILE NAVIGATION & SCROLL HEADER
       ========================================== */
    const navbar = document.querySelector('.navbar');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');

    // Add scrolled class to navbar when scrolling down past banner
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle menu drawer on mobile click
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu drawer when clicking links
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavToggle) mobileNavToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    /* ==========================================
       HIGHLIGHT ACTIVE PAGE IN NAV
       ========================================== */
    const path = window.location.pathname;
    const page = path.split("/").pop();

    navLinkItems.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (page === '' || page === 'index.html') {
            if (href === 'index.html') link.classList.add('active');
        } else if (page === href) {
            link.classList.add('active');
        }
    });

    /* ==========================================
       SCROLL TO TOP BUTTON
       ========================================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================
       CUSTOM AUDIO PLAYER CONTROLLER
       ========================================== */
    const trackPlayers = document.querySelectorAll('.audio-track-item');
    let activeAudio = null;
    let activePlayer = null;

    trackPlayers.forEach(player => {
        const audio = player.querySelector('audio');
        const playPauseBtn = player.querySelector('.play-pause-btn');
        const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
        const progressFill = player.querySelector('.progress-fill');
        const handle = player.querySelector('.timeline-handle');
        const timeline = player.querySelector('.timeline-container');
        const currentTimeEl = player.querySelector('.current-time');
        const durationEl = player.querySelector('.duration-time');

        if (!audio || !playPauseBtn) return;

        // Format time in MM:SS
        function formatTime(seconds) {
            if (isNaN(seconds)) return '00:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Set duration once metadata is loaded
        audio.addEventListener('loadedmetadata', () => {
            if (durationEl) durationEl.textContent = formatTime(audio.duration);
        });

        // Fallback for cached audio
        if (audio.readyState >= 1) {
            if (durationEl) durationEl.textContent = formatTime(audio.duration);
        }

        // Update progress slider and time label
        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressFill) progressFill.style.width = `${percent}%`;
            if (handle) handle.style.left = `${percent}%`;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        // Reset player UI on track completion
        audio.addEventListener('ended', () => {
            if (playIcon) playIcon.className = 'fa-solid fa-play';
            player.classList.remove('playing');
            if (progressFill) progressFill.style.width = '0%';
            if (handle) handle.style.left = '0%';
            if (currentTimeEl) currentTimeEl.textContent = '00:00';
            activeAudio = null;
            activePlayer = null;
        });

        // Toggle playback
        function togglePlayback() {
            if (activeAudio && activeAudio !== audio) {
                // Pause current active audio
                activeAudio.pause();
                if (activePlayer) {
                    activePlayer.classList.remove('playing');
                    const activeIcon = activePlayer.querySelector('.play-pause-btn i');
                    if (activeIcon) activeIcon.className = 'fa-solid fa-play';
                }
            }

            if (audio.paused) {
                audio.play();
                if (playIcon) playIcon.className = 'fa-solid fa-pause';
                player.classList.add('playing');
                activeAudio = audio;
                activePlayer = player;
            } else {
                audio.pause();
                if (playIcon) playIcon.className = 'fa-solid fa-play';
                player.classList.remove('playing');
                activeAudio = null;
                activePlayer = null;
            }
        }

        playPauseBtn.addEventListener('click', togglePlayback);

        // Scrubbing on timeline click
        if (timeline) {
            timeline.addEventListener('click', (e) => {
                const rect = timeline.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percentage = Math.max(0, Math.min(1, clickX / width));
                
                if (audio.duration) {
                    audio.currentTime = percentage * audio.duration;
                }
            });
        }
    });

    /* ==========================================
       YOMIM NORAIM VIDEO PLAYLIST CONTROLLER
       ========================================== */
    const playlistTracks = document.querySelectorAll('.playlist-track-item');
    const mainIframe = document.querySelector('.playlist-player iframe');

    if (playlistTracks.length > 0 && mainIframe) {
        playlistTracks.forEach(track => {
            track.addEventListener('click', () => {
                // Remove active class from all tracks
                playlistTracks.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked track
                track.classList.add('active');
                
                // Get video ID from data-video-id attribute
                const videoId = track.getAttribute('data-video-id');
                
                // Update iframe source with autoplay enabled
                mainIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;

                // Update caption title dynamically
                const trackName = track.querySelector('.playlist-track-name').textContent;
                const videoTitleEl = document.getElementById('currentVideoTitle');
                if (videoTitleEl) {
                    videoTitleEl.textContent = trackName;
                }
            });
        });
    }

    /* ==========================================
       SIMPLIFIED INLINE BOOKING FORM SUBMISSION
       ========================================== */
    const bookingForm = document.getElementById('bookingForm');
    const formSuccessMessage = document.getElementById('formSuccessMessage');

    if (bookingForm && formSuccessMessage) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide form and display simple success note inline
            bookingForm.style.display = 'none';
            formSuccessMessage.classList.add('active');
            
            // Scroll to the top of the form container for visibility
            const formContainer = bookingForm.parentElement;
            if (formContainer) {
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

});
