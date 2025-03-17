/*
* DICE ANIMATIONS
* 
* This file manages all visual animations related to dice rolling.
* It is responsible for coordinating the visual feedback when dice are rolled,
* including spinning dice icons and transitioning result numbers.
* It receives all necessary data through parameters rather than accessing state directly.
*
* This file:
* 1. Animates dice button icons when rolling (animateDiceIcons)
* 2. Manages d10 percentile mode animations (resetD10State, animatePercentileRoll)
* 3. Handles number result animations in the results area (animateNumberResult)
* 4. Coordinates the animation of results and total display (animateResults)
*/

/**
 * Check if a die type is a standard die (d4, d6, d8, d10, d12, d20)
 * @param {string} dieType - The type of die to check
 * @returns {boolean} Whether the die is standard
 */
function isStandardDie(dieType) {
  return ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType);
}

/**
 * Physics-based deceleration function
 * @param {number} t - Elapsed time in milliseconds
 * @param {number} p_f - Final position/angle
 * @param {number} A - Amplitude (typically final - initial)
 * @param {number} tau - Time constant controlling deceleration rate
 * @returns {number} - Current position/angle at time t
 */
function decelerate(t, p_f, A, tau) {
  return p_f - A * Math.exp(-t / tau);
}

/**
 * Animate dice icons spinning with physics-based deceleration
 * @param {Array} diceToAnimate - Array of dice types to animate
 * @returns {number} - Animation duration in milliseconds
 */
export function animateDiceIcons(diceToAnimate) {
  const durationMs = 2000;
  const tau = 325; // Time constant for appropriate deceleration (in ms)
  const finalAngle = 360 * 3; // 3 full spins in degrees
  const initialAngle = 0;
  const amplitude = finalAngle - initialAngle;
  
  // Track all ongoing animations to ensure they complete
  const animationPromises = [];
  
  diceToAnimate.forEach(dieType => {
    const dieButtons = document.querySelectorAll(`.die-button[data-die="${dieType}"] img`);
    
    dieButtons.forEach(button => {
      // Create a promise that resolves when animation completes
      const animationPromise = new Promise(resolve => {
        let startTime = null;
        let animationFrameId = null;
        
        // Animation step function
        function animateStep(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsedTime = timestamp - startTime;
          
          if (elapsedTime < durationMs) {
            // Calculate current angle using deceleration function
            const currentAngle = decelerate(elapsedTime, finalAngle, amplitude, tau);
            
            // Apply rotation
            button.style.transform = `rotate(${currentAngle}deg)`;
            
            // Continue animation
            animationFrameId = requestAnimationFrame(animateStep);
          } else {
            // Ensure we end at exactly the final angle
            button.style.transform = `rotate(${finalAngle}deg)`;
            
            // Reset after a brief delay to avoid visual glitch
            setTimeout(() => {
              button.style.transform = '';
            }, 50);
            
            resolve();
          }
        }
        
        // Start the animation
        animationFrameId = requestAnimationFrame(animateStep);
      });
      
      animationPromises.push(animationPromise);
    });
  });
  
  // Wait for all animations to complete (useful if we need to chain animations)
  Promise.all(animationPromises).then(() => {
    console.log('All dice animations completed');
  });
  
  return durationMs;
}

/**
 * Generate a random number for a specific die type
 * @param {string} dieType - Type of die (e.g., 'd20', 'd6')
 * @returns {number|string} - Random number appropriate for the die type
 */
function getRandomValueForDie(dieType) {
  // Handle percentile special cases
  if (dieType === 'd10-tens') {
    // Returns 00, 10, 20, ..., 90
    const tens = Math.floor(Math.random() * 10);
    return (tens * 10).toString().padStart(2, '0');
  } else if (dieType === 'd10-ones') {
    // Returns 0-9
    return Math.floor(Math.random() * 10);
  }
  
  // Standard dice
  const sides = parseInt(dieType.slice(1), 10);
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Animate a single number result with randomization effect
 * @param {HTMLElement} element - Element to animate
 * @param {number|string} finalValue - Final value to display
 * @param {string} dieType - Type of die for styling
 * @param {number} durationMs - Animation duration
 */
function animateNumberResult(element, finalValue, dieType, durationMs) {
  element.dataset.die = dieType;
  
  // Animation parameters
  const numberAnimDuration = 1000; // Numbers settle after 1000ms
  const initialInterval = 50; // Start updating every 50ms (20fps)
  const maxInterval = 200; // Slow down to updating every 200ms
  
  // Start animation
  let startTime = Date.now();
  let lastUpdateTime = 0;
  let currentInterval = initialInterval;
  
  // Start with a random value
  element.textContent = getRandomValueForDie(dieType);
  
  // Animation function
  function updateNumber() {
    const elapsed = Date.now() - startTime;
    
    if (elapsed < numberAnimDuration) {
      // Calculate progress (0 to 1)
      const progress = Math.min(elapsed / numberAnimDuration, 1);
      
      // Slow down updates as we progress
      // This creates a more natural deceleration effect
      currentInterval = initialInterval + (maxInterval - initialInterval) * progress;
      
      // Only update if enough time has passed since last update
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate >= currentInterval) {
        // Chance of showing final value increases as we progress
        if (Math.random() < Math.pow(progress, 2)) {
          element.textContent = finalValue;
        } else {
          element.textContent = getRandomValueForDie(dieType);
        }
        lastUpdateTime = Date.now();
      }
      
      // Schedule next frame
      requestAnimationFrame(updateNumber);
    } else {
      // Ensure we end with the final value
      element.textContent = finalValue;
    }
  }
  
  // Start animation
  requestAnimationFrame(updateNumber);
}

/**
 * Animate roll results and total
 * @param {Object} animationData - Data needed for animation
 * @param {Array} animationData.rolls - Array of roll results
 * @param {Array} animationData.diceTypes - Array of corresponding dice types
 * @param {number} animationData.total - Final total to display
 * @param {number} durationMs - Animation duration
 */
export function animateResults({ rolls, diceTypes, total }, durationMs) {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (!resultsRollsEl || !resultsTotalEl) return;
  
  // Clear existing results
  resultsRollsEl.innerHTML = '';
  
  // Create and animate result boxes only for standard dice
  rolls.forEach((roll, index) => {
    const dieType = diceTypes[index];
    // Skip non-standard dice
    if (!isStandardDie(dieType)) return;
    
    const rollBox = document.createElement('div');
    rollBox.className = 'roll-box';
    
    if (typeof roll === 'object' && roll.type) {
      // Percentile roll
      animateNumberResult(rollBox, roll.value, roll.type, durationMs);
    } else {
      // Regular roll
      animateNumberResult(rollBox, roll, dieType, durationMs);
    }
    
    resultsRollsEl.appendChild(rollBox);
  });
  
  // Animate total
  const totalValue = resultsTotalEl.querySelector('.total-value');
  if (totalValue) {
    const currentTotal = totalValue.textContent || '0';
    totalValue.textContent = currentTotal;
    
    setTimeout(() => {
      totalValue.textContent = total;
    }, durationMs);
  }
}

/**
 * Reset d10 button state
 * @param {HTMLElement} button - The d10 button to reset
 */
export function resetD10State(button) {
  if (!button) return;
  
  button.classList.remove('percentile-active', 'first-animation');
  const mainDie = button.querySelector('.main-die');
  const coloredDice = button.querySelectorAll('.colored-die');
  
  if (mainDie) mainDie.classList.remove('spin');
  coloredDice.forEach(die => {
    die.classList.remove('spin');
    die.style.transform = '';
  });
}

