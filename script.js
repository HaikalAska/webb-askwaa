// Audio player functionality
const audio = new Audio('ssstik.io_1759520762289.mp3');
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');

// Set initial volume
audio.volume = 0.5;

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶';
    }
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Auto loop
audio.loop = true;

// Floating hearts animation
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('heartsContainer').appendChild(heart);
    
    setTimeout(() => heart.remove(), 8000);
}

setInterval(createHeart, 500);

// Auto scroll gallery on mobile
let galleryAutoScroll;
let galleryScrollIndex = 0;
const gallery = document.querySelector('.gallery-wrapper');

function startGalleryAutoScroll() {
    if (window.innerWidth <= 768 && gallery) {
        galleryAutoScroll = setInterval(() => {
            const cards = document.querySelectorAll('.photo-card');
            if (cards.length > 0) {
                galleryScrollIndex = (galleryScrollIndex + 1) % cards.length;
                const scrollAmount = galleryScrollIndex * (window.innerWidth * 0.9 + 16); // 90vw + gap
                gallery.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 3000); // Auto scroll setiap 3 detik
    }
}

function stopGalleryAutoScroll() {
    if (galleryAutoScroll) {
        clearInterval(galleryAutoScroll);
    }
}

// Start auto scroll when on slide 2
let lastSlide = -1;

// Smooth scroll navigation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function scrollToSlide(index) {
    currentSlide = index;
    slides[index].scrollIntoView({ behavior: 'smooth' });
    updateDots();
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Scroll detection
let isScrolling;
window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const slideHeight = window.innerHeight;
        currentSlide = Math.round(scrollPosition / slideHeight);
        updateDots();
        
        // Control gallery auto scroll
        if (currentSlide === 1 && lastSlide !== 1) {
            startGalleryAutoScroll();
        } else if (currentSlide !== 1 && lastSlide === 1) {
            stopGalleryAutoScroll();
        }
        lastSlide = currentSlide;
    }, 100);
});

// Mouse wheel navigation
let isThrottled = false;
window.addEventListener('wheel', (e) => {
    if (isThrottled) return;
    isThrottled = true;
    
    if (e.deltaY > 0 && currentSlide < slides.length - 1) {
        scrollToSlide(currentSlide + 1);
    } else if (e.deltaY < 0 && currentSlide > 0) {
        scrollToSlide(currentSlide - 1);
    }
    
    setTimeout(() => isThrottled = false, 1000);
});

// Stop auto scroll when user touches gallery
if (gallery) {
    gallery.addEventListener('touchstart', stopGalleryAutoScroll);
    gallery.addEventListener('mousedown', stopGalleryAutoScroll);
}
