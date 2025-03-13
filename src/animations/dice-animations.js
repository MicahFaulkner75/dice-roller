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
 * Animate dice icons spinning
 * @param {Array} diceToAnimate - Array of dice types to animate
 * @returns {number} - Animation duration in milliseconds
 */
export function animateDiceIcons(diceToAnimate) {
  const durationMs = 2000;
  
  diceToAnimate.forEach(dieType => {
    const dieButtons = document.querySelectorAll(`.die-button[data-die="${dieType}"] img`);
    dieButtons.forEach(button => {
      const finalAngle = 360 * 3; // 3 full spins
      button.style.transition = `transform ${durationMs}ms cubic-bezier(0.2, 0, 0.8, 1)`;
      button.style.transform = `rotate(${finalAngle}deg)`;
      
      // Reset after animation
      setTimeout(() => {
        button.style.transition = '';
        button.style.transform = '';
      }, durationMs);
    });
  });
  
  return durationMs;
}

/**
 * Animate a single number result
 * @param {HTMLElement} element - Element to animate
 * @param {number|string} finalValue - Final value to display
 * @param {string} dieType - Type of die for styling
 * @param {number} durationMs - Animation duration
 */
function animateNumberResult(element, finalValue, dieType, durationMs) {
  element.dataset.die = dieType;
  
  // Start with empty content
  element.textContent = '';
  
  // Add the final value after a delay
  setTimeout(() => {
    element.textContent = finalValue;
  }, durationMs * 0.75); // Show number at 75% of animation
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

