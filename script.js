// --- Carousel & Navigation Logic ---
const track = document.getElementById('sliderTrack');
const slides = Array.from(track.children);
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function updateSlider(index) {
    if (index < 0) index = 0;
    if (index > slides.length - 1) index = slides.length - 1;
    
    currentIndex = index;
    track.style.transition = 'transform 0.4s ease-out';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    updateDots(currentIndex);
}

function updateDots(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    if(dots[index]) {
        dots[index].classList.add('active');
    }
}

// Button Listeners
nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) updateSlider(currentIndex + 1);
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) updateSlider(currentIndex - 1);
});

// Dot Listeners
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateSlider(index));
});

// --- Mouse Drag / Swipe Logic ---
const sliderContainer = document.getElementById('sliderContainer');

sliderContainer.addEventListener('mousedown', dragStart);
sliderContainer.addEventListener('mouseup', dragEnd);
sliderContainer.addEventListener('mouseleave', dragEnd);
sliderContainer.addEventListener('mousemove', drag);

function dragStart(event) {
    isDragging = true;
    startPos = event.clientX;
    track.style.transition = 'none';
    const slideWidth = sliderContainer.clientWidth;
    prevTranslate = currentIndex * -slideWidth;
}

function drag(event) {
    if (!isDragging) return;
    const currentPosition = event.clientX;
    const distanceMoved = currentPosition - startPos;
    
    if ((currentIndex === 0 && distanceMoved > 0) || 
        (currentIndex === slides.length - 1 && distanceMoved < 0)) {
        currentTranslate = prevTranslate + (distanceMoved / 3);
    } else {
        currentTranslate = prevTranslate + distanceMoved;
    }
    
    track.style.transform = `translateX(${currentTranslate}px)`;
}

function dragEnd(event) {
    if (!isDragging) return;
    isDragging = false;
    
    const distanceMoved = event.clientX - startPos;
    
    if (distanceMoved < -100 && currentIndex < slides.length - 1) {
        currentIndex += 1;
    } else if (distanceMoved > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }
    
    updateSlider(currentIndex);
}

document.querySelectorAll('.slide').forEach(slide => {
    slide.addEventListener('dragstart', (e) => e.preventDefault());
});


// --- Widget 3: Music Player Toggle Logic ---
const playBtn = document.getElementById('playBtn');
let isPlaying = false;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.innerHTML = isPlaying ? '&#10074;&#10074;' : '&#9654;'; // Pause icon / Play icon
});


// --- Widget 4: Real-Time Clock & Date Logic ---
function updateClock() {
    const now = new Date();
    
    // Time format
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    document.getElementById('timeDisplay').innerText = hours + ':' + minutes;
    document.getElementById('ampmDisplay').innerText = ampm;
    
    // Date format
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    document.getElementById('dateDisplay').innerText = now.toLocaleDateString('en-US', options);
}

// Initialize clock immediately, then update every second
updateClock();
setInterval(updateClock, 1000);