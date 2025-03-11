export function animateDiceIcons(dice) {
  // Get all dice buttons that need to be animated
  const diceToAnimate = dice || [];
  const durationMs = 2000;
  
  console.log("Animating dice:", diceToAnimate);
  
  // Apply spin animation to matching dice buttons
  diceToAnimate.forEach(dieType => {
    // Handle both d10 and d00 using the d10 button
    const buttonSelector = dieType === 'd00' ? 'd10' : dieType;
    const button = document.querySelector(`.die-button[data-die="${buttonSelector}"]`);
    console.log(`Looking for button with [data-die="${buttonSelector}"]`, button);
    
    if (button) {
      if (dieType === 'd00' && button.classList.contains('percentile-active')) {
        // For percentile mode, animate all visible dice layers
        const allDice = button.querySelectorAll('.magenta-die, .colored-die');
        allDice.forEach(die => {
          // Only animate if the die is visible
          if (getComputedStyle(die).opacity !== '0') {
            die.classList.remove('spin');
            // Force reflow
            void die.offsetWidth;
            die.classList.add('spin');
          }
        });
      } else if (dieType === 'd10' && !button.classList.contains('percentile-active')) {
        // For regular d10 mode, just animate the main die
        const mainDie = button.querySelector('.main-die');
        if (mainDie) {
          mainDie.classList.remove('spin');
          void mainDie.offsetWidth;
          mainDie.classList.add('spin');
        }
      }
    }
  });
  
  return durationMs;
}

// Add a function to reset the d10 state
export function resetD10State() {
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  if (d10Button) {
    // Remove percentile mode and first animation classes
    d10Button.classList.remove('percentile-active', 'first-animation');
    
    // Reset all dice to initial state
    const allDice = d10Button.querySelectorAll('.magenta-die, .colored-die, .main-die');
    allDice.forEach(die => {
      die.classList.remove('spin');
    });

    // Ensure proper opacity states
    const mainDie = d10Button.querySelector('.main-die');
    const coloredDice = d10Button.querySelectorAll('.colored-die');
    const magentaDice = d10Button.querySelectorAll('.magenta-die');
    
    if (mainDie) mainDie.style.opacity = '1';
    coloredDice.forEach(die => die.style.opacity = '0');
    magentaDice.forEach(die => die.style.opacity = '0');
  }
}

// Add a function to handle percentile roll animation
export function animatePercentileRoll() {
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  if (d10Button && d10Button.classList.contains('percentile-active')) {
    const allDice = d10Button.querySelectorAll('.magenta-die, .colored-die');
    allDice.forEach(die => {
      if (getComputedStyle(die).opacity !== '0') {
        die.classList.remove('spin');
        void die.offsetWidth;
        die.classList.add('spin');
      }
    });
    return true;
  }
  return false;
}

export function animateResults(rolls, total, durationMs) {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total').querySelector('div:nth-child(2)');
  
  console.log("Animating results:", rolls, total);
  
  if (!resultsRollsEl || !resultsTotalEl) {
    console.log("Could not find results elements");
    return;
  }
  
  // Add a temporary class for animation
  resultsRollsEl.classList.add('animating');
  resultsTotalEl.classList.add('animating');
  
  // Set the final values after animation duration
  setTimeout(() => {
    resultsRollsEl.classList.remove('animating');
    resultsTotalEl.classList.remove('animating');
  }, durationMs);
}

