// ===================== SLIDER SETUP =====================

// We get (select) elements from the HTML
const slider = document.querySelector('.slider');          // Selects the main slider container
const slides = document.querySelectorAll('.slide');        // Selects all individual slides
const nextBtn = document.getElementById('next');           // Selects the "next" button
const prevBtn = document.getElementById('prev');           // Selects the "previous" button
const dotsContainer = document.querySelector('.dots');     // Selects the container for navigation dots


// ===================== CLONE SLIDES FOR INFINITE LOOP =====================

// Clone first and last slides for smooth looping
const firstClone = slides[0].cloneNode(true);              // Duplicate first slide
const lastClone = slides[slides.length - 1].cloneNode(true); // Duplicate last slide

// Give IDs to cloned slides (so we can detect them later)
firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

// Add clones to the DOM
slider.appendChild(firstClone); // Put first clone at the end
slider.prepend(lastClone);      // Put last clone at the beginning

// Update our slides NodeList to include the clones
const allSlides = document.querySelectorAll('.slide');

// Start at the first real slide (index = 1, because 0 is lastClone)
let index = 1;

// Automatically move every 3 seconds
let autoSlide = setInterval(moveSlide, 5000);


// ===================== CREATE DOTS =====================

// We loop through only the REAL slides (not clones)
for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement('button'); // Create <button> for each dot
  if (i === 0) dot.classList.add('active');     // First dot active by default
  dotsContainer.appendChild(dot);               // Add dot to the container
}

// Select all the created dots
const dots = document.querySelectorAll('.dots button');


// ===================== MAIN FUNCTIONS =====================

// Function to display a specific slide
function showSlide(i) {
  // Remove 'active' from all real slides
  allSlides.forEach(slide => slide.classList.remove('active'));
  allSlides[i].classList.add('active');

  // Sync the dots — but skip clones
  dots.forEach(dot => dot.classList.remove('active'));
  if (i === 0) dots[dots.length - 1].classList.add('active'); // if at lastClone
  else if (i === allSlides.length - 1) dots[0].classList.add('active'); // if at firstClone
  else dots[i - 1].classList.add('active'); // normal case

  // Apply smooth transition and move horizontally
  slider.style.transition = 'transform 0.8s ease-in-out';
  slider.style.transform = `translateX(calc(-${i * (70 + 1)}% - ${i * 1}rem))`;
}


// Function to automatically move the slider
function moveSlide() {
  index++;
  showSlide(index);
}


// ===================== EVENT HANDLERS =====================

// ===================== MANUAL NAVIGATION (NEXT / PREV) =====================

// Move to next slide
function nextSlide() {
  index++;                // increase index
  showSlide(index);       // show new slide
  resetAuto();            // restart auto scrolling
}

// Move to previous slide
function prevSlide() {
  index--;                // decrease index
  showSlide(index);
  resetAuto();
}

// ------------ Attach prev/next button listeners ------------
nextBtn.addEventListener('click', () => {
  // If slider transition is temporarily disabled (when looping), restore it
  if (slider.style.transition === 'none') {
    slider.style.transition = 'transform 0.8s ease-in-out';
  }
  nextSlide();
});

prevBtn.addEventListener('click', () => {
  if (slider.style.transition === 'none') {
    slider.style.transition = 'transform 0.8s ease-in-out';
  }
  prevSlide();
});



// ===================== LOOP TRANSITION FIX =====================

// When slide transition ends, check if we hit a cloned slide
slider.addEventListener('transitionend', () => {
  if (allSlides[index].id === 'first-clone') {
    // If we reached the cloned first slide, jump to real first slide
    slider.style.transition = 'none'; // Remove animation
    index = 1; // Real first slide index
    slider.style.transform = `translateX(calc(-${index * (70 + 1)}% - ${index * 1}rem))`;
  }

  if (allSlides[index].id === 'last-clone') {
    // If we reached the cloned last slide, jump to real last slide
    slider.style.transition = 'none';
    index = allSlides.length - 2; // Real last slide index
    slider.style.transform = `translateX(calc(-${index * (100)}% - ${index * 1}rem))`;
  }
});


// ===================== DOT NAVIGATION =====================

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    index = i + 1; // +1 because index 0 is lastClone
    showSlide(index);
    resetAuto();
  });
});


// ===================== HOVER BEHAVIOR =====================

// Pause auto slide when mouse enters
slider.addEventListener('mouseenter', () => clearInterval(autoSlide));

// Resume auto slide when mouse leaves
slider.addEventListener('mouseleave', () => autoSlide = setInterval(moveSlide, 4000));


// ===================== AUTO SLIDE RESET =====================

function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(moveSlide, 4000);
}


// ===================== INITIALIZE =====================

// Start from the first real slide
showSlide(index);
