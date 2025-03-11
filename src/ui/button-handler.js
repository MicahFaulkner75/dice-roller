import { state, addDie, clearDice } from '../state';
import { rollAllDice, computeTotal } from '../dice-logic';
import { animateDiceIcons, animateResults } from '../animations/dice-animations';
import { updateDisplay } from './display';

export function setupDiceButtons() {
  const dieButtons = document.querySelectorAll('.die-button');
  dieButtons.forEach(button => {
    let pressTimer;
    let lastClickTime = 0;
    const doubleClickDelay = 300; // ms between clicks to count as double-click
    let isLongPress = false;  // Track if we're handling a long press
    let isDoubleClick = false; // Track if we're handling a double click
    
    // Single click handler
    button.addEventListener('click', (e) => {
      // Always prevent click if it was a long press
      if (isLongPress) {
        e.preventDefault();
        e.stopPropagation();
        isLongPress = false;
        return;
      }
      
      const currentTime = Date.now();
      if (currentTime - lastClickTime < doubleClickDelay) {
        // Double click detected
        e.preventDefault();
        e.stopPropagation();
        isDoubleClick = true;
        handlePercentileRoll();
        // Reset after a delay longer than single click handling
        setTimeout(() => {
          isDoubleClick = false;
        }, doubleClickDelay + 50);
      } else {
        // Single click - only handle if not in a double-click
        if (!isDoubleClick) {
          handleDieClick(button);
        }
      }
      lastClickTime = currentTime;
    });
    
    // Long press handlers
    button.addEventListener('mousedown', (e) => {
      pressTimer = setTimeout(() => {
        isLongPress = true;
        handlePercentileRoll();
        // Prevent any click events from firing
        e.preventDefault();
        e.stopPropagation();
      }, 500);
    });
    
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();  // Prevent touch event from triggering click
      pressTimer = setTimeout(() => {
        isLongPress = true;
        handlePercentileRoll();
      }, 500);
    });
    
    // Clear timer if mouse/touch ends
    const clearTimer = (e) => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      // If it was a long press, prevent click
      if (isLongPress) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    button.addEventListener('mouseup', clearTimer);
    button.addEventListener('mouseleave', clearTimer);
    button.addEventListener('touchend', clearTimer);
    button.addEventListener('touchcancel', clearTimer);
  });
}

function handleDieClick(button) {
  const dieType = button.dataset.die;
  console.log(`${dieType} button clicked`);
  
  // Remove percentile mode from d10 if we're clicking a different die
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  if (d10Button && dieType !== 'd10') {
    d10Button.classList.remove('percentile-active');
  }
  
  // Check if we currently have a percentile roll
  const hasPercentile = state.selectedDice.length === 1 && 
    (state.selectedDice[0] === 'd00' || state.selectedDice[0] === 'd100');
  
  // If there's a percentile roll, clear everything first
  if (hasPercentile) {
    console.log("Clearing percentile roll before adding new die");
    clearDice();
    state.lastTotal = undefined;
  }
  
  // Add the clicked die to the pool
  addDie(dieType);
  
  // Roll and animate
  rollAndAnimate([dieType]);
}

// Move decelerate function to global scope
function decelerate(t, p_f, A, tau) {
  return p_f - A * Math.exp(-t / tau);
}

// Add function to handle subsequent percentile rolls
function spinPercentileDice() {
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  if (!d10Button || !d10Button.classList.contains('percentile-active')) return;

  const magentaDice = d10Button.querySelectorAll('.magenta-die');
  const coloredDice = d10Button.querySelectorAll('.colored-die');
  
  // Get current positions
  const leftOffset = -15;
  const rightOffset = 15;
  const startAngle = parseFloat(coloredDice[0].style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] || '0');
  
  // Animation parameters
  const duration = 2000;
  const additionalRotation = 1080; // 3 full rotations
  const tau = 325;
  
  const startTime = performance.now();
  
  function spinStep(currentTime) {
    const elapsed = currentTime - startTime;
    if (elapsed < duration) {
      const progress = elapsed / duration;
      const angle = startAngle + decelerate(progress, additionalRotation, additionalRotation, tau / duration);
      
      // Keep dice in their split positions while spinning
      magentaDice.forEach((die, index) => {
        const offset = index === 0 ? leftOffset : rightOffset;
        die.style.transform = `translateX(${offset}px) rotate(${angle}deg)`;
      });
      
      coloredDice.forEach((die, index) => {
        const offset = index === 0 ? leftOffset : rightOffset;
        die.style.transform = `translateX(${offset}px) rotate(${angle}deg)`;
      });
      
      requestAnimationFrame(spinStep);
    }
  }
  
  requestAnimationFrame(spinStep);
}

// Modify rollAndAnimate to handle percentile mode
function rollAndAnimate(dice) {
  try {
    // Roll the dice
    rollAllDice();
    
    // Check if we're in percentile mode
    const d10Button = document.querySelector('.die-button[data-die="d10"]');
    const isPercentile = d10Button && d10Button.classList.contains('percentile-active');
    
    if (isPercentile && dice[0] === 'd00') {
      spinPercentileDice();
    }
    
    // Animate the dice and results
    const durationMs = animateDiceIcons(dice);
    setTimeout(() => {
      try {
        // For percentile rolls, use lastTotal
        const total = state.lastTotal !== undefined ? 
          state.lastTotal : 
          state.currentRolls.reduce((sum, roll) => {
            if (typeof roll === 'number') {
              return sum + roll;
            } else if (roll && roll.value) {
              return sum + (parseInt(roll.value, 10) || 0);
            }
            return sum;
          }, 0) + state.modifier;

        animateResults(state.currentRolls, total, durationMs);
      } catch (error) {
        console.error("Error in total calculation:", error);
      }
      updateDisplay();
    }, durationMs);
  } catch (error) {
    console.error("Error in roll and animate:", error);
  }
}

// Update handlePercentileRoll to use the global decelerate function
function handlePercentileRoll() {
  console.log("Triggering percentile roll");
  
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  
  if (d10Button) {
    // Clear existing dice and set up percentile roll
    clearDice();
    state.selectedDice = ['d00'];
    console.log("Set up percentile roll, state:", state.selectedDice);
    
    const isFirstActivation = !d10Button.classList.contains('percentile-active');
    
    if (isFirstActivation) {
      // First activation - do the split animation
      d10Button.classList.remove('percentile-active');
      void d10Button.offsetWidth;
      
      // Hide the main die immediately
      const mainDie = d10Button.querySelector('.main-die');
      if (mainDie) {
        mainDie.style.opacity = '0';
      }
      
      if (!d10Button.classList.contains('has-rolled-once')) {
        d10Button.classList.add('first-animation');
      }
      
      d10Button.classList.add('percentile-active');

      // Get all the dice that need animation
      const magentaDice = d10Button.querySelectorAll('.magenta-die');
      const coloredDice = d10Button.querySelectorAll('.colored-die');

      // Split animation parameters
      const duration = 2000;
      const finalAngle = 1080;
      const finalOffset = 15;
      const tau = 325;

      // Start the split animation
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const angle = decelerate(progress, finalAngle, finalAngle, tau / duration);
          const offset = decelerate(progress, finalOffset, finalOffset, tau / duration);

          magentaDice.forEach((die, index) => {
            const direction = index === 0 ? -1 : 1;
            die.style.transform = `translateX(${direction * offset}px) rotate(${angle}deg)`;
            die.style.opacity = '1'; // Ensure magenta dice are visible
          });

          coloredDice.forEach((die, index) => {
            const direction = index === 0 ? -1 : 1;
            die.style.transform = `translateX(${direction * offset}px) rotate(${angle}deg)`;
            
            if (!d10Button.classList.contains('has-rolled-once')) {
              die.style.opacity = progress.toString();
            }
          });

          requestAnimationFrame(step);
        } else {
          // Set final positions
          magentaDice.forEach((die, index) => {
            const direction = index === 0 ? -1 : 1;
            die.style.transform = `translateX(${direction * finalOffset}px) rotate(${finalAngle}deg)`;
            die.style.opacity = '1';
          });

          coloredDice.forEach((die, index) => {
            const direction = index === 0 ? -1 : 1;
            die.style.transform = `translateX(${direction * finalOffset}px) rotate(${finalAngle}deg)`;
            die.style.opacity = '1';
          });

          if (!d10Button.classList.contains('has-rolled-once')) {
            d10Button.classList.add('has-rolled-once');
            d10Button.classList.remove('first-animation');
          }
        }
      }

      requestAnimationFrame(step);
    } else {
      spinPercentileDice();
    }
    
    // Roll and animate
    rollAndAnimate(['d00']);
  }
}


