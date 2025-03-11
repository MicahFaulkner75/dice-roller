/*
* DICE ANIMATIONS
* 
* This file manages all visual animations related to dice rolling.
* It is responsible for coordinating the visual feedback when dice are rolled,
* including spinning dice icons and transitioning result numbers.
*
* This file:
* 1. Animates dice button icons when rolling (animateDiceIcons)
* 2. Manages d10 percentile mode animations (resetD10State, animatePercentileRoll)
* 3. Handles number result animations in the results area (animateNumberResult)
* 4. Coordinates the animation of results and total display (animateResults)
*/

import { state } from '../state';

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
      if (dieType === 'd00') {
        // For percentile mode, animate all visible dice layers
        const allDice = button.querySelectorAll('.colored-die');
        allDice.forEach(die => {
          // Only animate if the die is visible
          if (getComputedStyle(die).opacity !== '0') {
            die.classList.remove('spin');
            // Force reflow
            void die.offsetWidth;
            die.classList.add('spin');
          }
        });
      } else {
        // For regular dice, just animate the main die
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

function animateNumberResult(element, finalValue, dieType, duration) {
  // Make number animation end 1s before dice animation
  const numberDuration = duration - 1000;
  const fps = 12;
  const interval = 1000 / fps;
  const startTime = performance.now();
  let lastUpdateTime = startTime;

  function getRandomValueForDie(dieType) {
    if (dieType === 'd10-tens') {
      return (Math.floor(Math.random() * 10) * 10).toString().padStart(2, '0');
    } else if (dieType === 'd10-ones') {
      return Math.floor(Math.random() * 10);
    } else {
      const sides = parseInt(dieType.slice(1), 10);
      return Math.floor(Math.random() * sides) + 1;
    }
  }

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    
    if (elapsed >= numberDuration) {
      element.textContent = finalValue;
      return;
    }

    if (currentTime - lastUpdateTime >= interval) {
      const randomValue = getRandomValueForDie(element.dataset.die || dieType);
      element.textContent = randomValue;
      lastUpdateTime = currentTime;
    }

    requestAnimationFrame(updateNumber);
  }

  // Start immediately with a random value
  element.textContent = getRandomValueForDie(element.dataset.die || dieType);
  requestAnimationFrame(updateNumber);
}

export function animateResults(rolls, total, durationMs) {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (!resultsRollsEl || !resultsTotalEl) return;

  // 1. Clear existing results
  resultsRollsEl.innerHTML = '';
  
  // 2. Create result boxes and start animations immediately
  const startTime = performance.now();
  
  rolls.forEach((roll, index) => {
    const rollBox = document.createElement('div');
    rollBox.className = 'roll-box';
    
    if (typeof roll === 'object' && roll.type) {
      // Percentile roll
      rollBox.dataset.die = roll.type;
      animateNumberResult(rollBox, roll.value, roll.type, durationMs);
    } else {
      // Regular roll
      const dieType = state.selectedDice[index];
      rollBox.dataset.die = dieType;
      animateNumberResult(rollBox, roll, dieType, durationMs);
    }
    
    resultsRollsEl.appendChild(rollBox);
  });

  // 3. Keep total unchanged until animation completes
  const totalValue = resultsTotalEl.querySelector('.total-value');
  if (totalValue) {
    const currentTotal = totalValue.textContent || '0';
    totalValue.textContent = currentTotal;
    
    // Update total after animation ends
    setTimeout(() => {
      totalValue.textContent = total;
    }, durationMs);
  }
}

