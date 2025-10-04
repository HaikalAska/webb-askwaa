// ============================================
// AUDIO PLAYER FUNCTIONALITY
// ============================================
const audio = new Audio('ssstik.io_1759520762289.mp3');
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');

audio.volume = 0.5;
audio.loop = true;

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


// ============================================
// FLOATING HEARTS ANIMATION (SLIDE 1)
// ============================================
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


// ============================================
// AUTO SCROLL GALLERY (SLIDE 2)
// ============================================
let galleryAutoScroll;
let galleryScrollIndex = 0;
const gallery = document.querySelector('.gallery-wrapper');

function startGalleryAutoScroll() {
    if (window.innerWidth <= 768 && gallery) {
        galleryAutoScroll = setInterval(() => {
            const cards = document.querySelectorAll('.photo-card');
            if (cards.length > 0) {
                galleryScrollIndex = (galleryScrollIndex + 1) % cards.length;
                const scrollAmount = galleryScrollIndex * (window.innerWidth * 0.9 + 16);
                gallery.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 3000);
    }
}

function stopGalleryAutoScroll() {
    if (galleryAutoScroll) {
        clearInterval(galleryAutoScroll);
    }
}

if (gallery) {
    gallery.addEventListener('touchstart', stopGalleryAutoScroll);
    gallery.addEventListener('mousedown', stopGalleryAutoScroll);
}


// ============================================
// AUTO SCROLL REASONS CARDS (SLIDE 4)
// ============================================
let reasonsAutoScroll;
let reasonsScrollIndex = 0;
const reasonsGrid = document.getElementById('reasonsGrid');

function startReasonsAutoScroll() {
    if (reasonsGrid) {
        const cards = document.querySelectorAll('.reason-card');
        if (cards.length > 0) {
            reasonsAutoScroll = setInterval(() => {
                reasonsScrollIndex = (reasonsScrollIndex + 1) % cards.length;
                const cardWidth = cards[0].offsetWidth;
                const gap = parseInt(getComputedStyle(reasonsGrid).gap) || 24;
                const scrollAmount = reasonsScrollIndex * (cardWidth + gap);
                
                reasonsGrid.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }, 3000);
        }
    }
}

function stopReasonsAutoScroll() {
    if (reasonsAutoScroll) {
        clearInterval(reasonsAutoScroll);
    }
}

if (reasonsGrid) {
    reasonsGrid.addEventListener('touchstart', stopReasonsAutoScroll);
    reasonsGrid.addEventListener('mousedown', stopReasonsAutoScroll);
}


// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================
let currentSlide = 0;
let lastSlide = -1;
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


// ============================================
// SCROLL DETECTION
// ============================================
let isScrolling;
window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const slideHeight = window.innerHeight;
        currentSlide = Math.round(scrollPosition / slideHeight);
        currentSlide = Math.min(Math.max(currentSlide, 0), slides.length - 1);
        updateDots();
        
        // Control gallery auto scroll (Slide 2 - index 1)
        if (currentSlide === 1 && lastSlide !== 1) {
            startGalleryAutoScroll();
        } else if (currentSlide !== 1 && lastSlide === 1) {
            stopGalleryAutoScroll();
        }
        
        // Control reasons auto scroll (Slide 4 - index 3)
        if (currentSlide === 3 && lastSlide !== 3) {
            startReasonsAutoScroll();
        } else if (currentSlide !== 3 && lastSlide === 3) {
            stopReasonsAutoScroll();
        }
        
        lastSlide = currentSlide;
    }, 100);
});


// ============================================
// MOUSE WHEEL NAVIGATION (untuk laptop/desktop)
// ============================================
let isThrottled = false;
let wheelTimeout;

window.addEventListener('wheel', (e) => {
    // Jangan block scroll di dalam elemen yang bisa di-scroll
    const target = e.target;
    const scrollableParent = target.closest('.gallery-wrapper, .reasons-grid, .timeline-container');
    
    // Kalau ada elemen scrollable parent, biarkan scroll normal
    if (scrollableParent) {
        return;
    }
    
    // Prevent default scroll behavior untuk navigasi slide
    e.preventDefault();
    
    if (isThrottled) return;
    
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 30 && currentSlide < slides.length - 1) {
            isThrottled = true;
            scrollToSlide(currentSlide + 1);
            setTimeout(() => isThrottled = false, 1000);
        } else if (e.deltaY < -30 && currentSlide > 0) {
            isThrottled = true;
            scrollToSlide(currentSlide - 1);
            setTimeout(() => isThrottled = false, 1000);
        }
    }, 50);
}, { passive: false });


// ============================================
// TOUCH SWIPE NAVIGATION (untuk mobile)
// ============================================
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSlide < slides.length - 1) {
            // Swipe up
            scrollToSlide(currentSlide + 1);
        } else if (diff < 0 && currentSlide > 0) {
            // Swipe down
            scrollToSlide(currentSlide - 1);
        }
    }
}

// ============================================
// MOUSE DRAG TO SCROLL (SLIDE 4 - REASONS)
// ============================================
const reasonsWrapper = document.querySelector('.reasons-wrapper');
if (reasonsWrapper) {
    let isDown = false;
    let startX;
    let scrollLeft;

    reasonsWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        reasonsWrapper.style.cursor = 'grabbing';
        startX = e.pageX - reasonsWrapper.offsetLeft;
        scrollLeft = reasonsWrapper.scrollLeft;
    });

    reasonsWrapper.addEventListener('mouseleave', () => {
        isDown = false;
        reasonsWrapper.style.cursor = 'grab';
    });

    reasonsWrapper.addEventListener('mouseup', () => {
        isDown = false;
        reasonsWrapper.style.cursor = 'grab';
    });

    reasonsWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - reasonsWrapper.offsetLeft;
        const walk = (x - startX) * 2;
        reasonsWrapper.scrollLeft = scrollLeft - walk;
    });

    reasonsWrapper.style.cursor = 'grab';
}

// ============================================
// MOUSE DRAG TO SCROLL (SLIDE 5 - LOVE LETTER)
// ============================================
const loveLetter = document.querySelector('.love-letter');
if (loveLetter) {
    let isDown = false;
    let startY;
    let scrollTop;

    loveLetter.addEventListener('mousedown', (e) => {
        isDown = true;
        loveLetter.style.cursor = 'grabbing';
        startY = e.pageY - loveLetter.offsetTop;
        scrollTop = loveLetter.scrollTop;
    });

    loveLetter.addEventListener('mouseleave', () => {
        isDown = false;
        loveLetter.style.cursor = 'grab';
    });

    loveLetter.addEventListener('mouseup', () => {
        isDown = false;
        loveLetter.style.cursor = 'grab';
    });

    loveLetter.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - loveLetter.offsetTop;
        const walk = (y - startY) * 2;
        loveLetter.scrollTop = scrollTop - walk;
    });

    loveLetter.style.cursor = 'grab';
    
}

// ============================================
// MOUSE DRAG TO SCROLL (SLIDE 2 - GALLERY)
// ============================================
const galleryWrapper = document.querySelector('.gallery-wrapper');
if (galleryWrapper) {
    let isDown = false;
    let startX;
    let scrollLeft;

    galleryWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        galleryWrapper.style.cursor = 'grabbing';
        startX = e.pageX - galleryWrapper.offsetLeft;
        scrollLeft = galleryWrapper.scrollLeft;
    });

    galleryWrapper.addEventListener('mouseleave', () => {
        isDown = false;
        galleryWrapper.style.cursor = 'grab';
    });

    galleryWrapper.addEventListener('mouseup', () => {
        isDown = false;
        galleryWrapper.style.cursor = 'grab';
    });

    galleryWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryWrapper.offsetLeft;
        const walk = (x - startX) * 2;
        galleryWrapper.scrollLeft = scrollLeft - walk;
    });

    galleryWrapper.style.cursor = 'grab';
}

// ============================================
// ACCORDION QUESTION CARDS (SLIDE 3)
// ============================================
const questionCards = document.querySelectorAll('.question-card');

questionCards.forEach(card => {
    const answer = card.querySelector('.question-answer');
    answer.style.maxHeight = '0';
    answer.style.opacity = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease';
    answer.style.marginTop = '0';
    
    card.addEventListener('click', () => {
        const isOpen = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
        
        if (isOpen) {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.marginTop = '0';
            card.classList.remove('open');
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
            answer.style.marginTop = '0.8rem';
            card.classList.add('open');
        }
    });
});

// ============================================
// FLOATING HEARTS FOR ALL SLIDES
// ============================================
function createHeartForSlide(slideId) {
    const slide = document.getElementById(slideId);
    if (!slide) return;
    
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'hearts';
    slide.insertBefore(heartsContainer, slide.firstChild);
    
    function addHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 8000);
    }
    
    setInterval(addHeart, 500);
}

// Aktifkan hearts untuk semua slide
createHeartForSlide('slide2');
createHeartForSlide('slide3');
createHeartForSlide('slide4');
createHeartForSlide('slide5');
createHeartForSlide('slide6');

// ============================================
// DRAGGABLE PHOTOS (SLIDE 6)
// ============================================
const gridPhotos = document.querySelectorAll('.grid-photo');

gridPhotos.forEach(photo => {
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;

    photo.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        photo.style.cursor = 'grabbing';
        photo.style.zIndex = 100;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        updatePosition(photo, currentX, currentY);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            photo.style.cursor = 'grab';
        }
    });

    // Touch events untuk mobile - lebih spesifik
    let touchStartX, touchStartY;
    let moved = false;

    photo.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        moved = false;
    }, { passive: true });

    photo.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - touchStartX);
        const deltaY = Math.abs(touchY - touchStartY);
        
        // Hanya drag kalau geraknya horizontal, biar scroll vertikal tetap jalan
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
            moved = true;
            currentX = touchX - touchStartX;
            currentY = touchY - touchStartY;
            updatePosition(photo, currentX, currentY);
        }
    }, { passive: false });

    function updatePosition(el, x, y) {
        const rotation = el.style.transform.match(/rotate\([^)]+\)/)?.[0] || '';
        el.style.transform = `translate(${x}px, ${y}px) ${rotation}`;
    }
});
