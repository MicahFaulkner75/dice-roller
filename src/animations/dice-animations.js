export function animateDiceIcons(dice) {
  // Get all dice buttons that need to be animated
  const diceToAnimate = dice || [];
  const durationMs = 500; // Reduced from 1000ms to feel more responsive
  
  console.log("Animating dice:", diceToAnimate);
  
  // Apply spin animation to matching dice buttons
  diceToAnimate.forEach(dieType => {
    const button = document.querySelector(`.die-button[data-die="${dieType}"]`);
    console.log(`Looking for button with [data-die="${dieType}"]`, button);
    
    if (button) {
      const img = button.querySelector('img');
      console.log(`Found image in button:`, img);
      
      if (img) {
        // Add and remove the spin class to trigger CSS animation
        img.classList.add('spin');
        console.log(`Added spin class to ${dieType} image`);
        
        setTimeout(() => {
          img.classList.remove('spin');
          console.log(`Removed spin class from ${dieType} image`);
        }, durationMs);
      }
    }
  });
  
  return durationMs;
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

