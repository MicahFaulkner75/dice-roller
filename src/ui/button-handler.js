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
    
    // Single click handler
    button.addEventListener('click', (e) => {
      // Ignore click if it was a long press
      if (isLongPress) {
        isLongPress = false;
        return;
      }
      
      const currentTime = Date.now();
      if (currentTime - lastClickTime < doubleClickDelay) {
        // Double click detected
        e.preventDefault();
        handlePercentileRoll();
      } else {
        // Single click
        handleDieClick(button);
      }
      lastClickTime = currentTime;
    });
    
    // Long press handlers
    button.addEventListener('mousedown', () => {
      pressTimer = setTimeout(() => {
        isLongPress = true;
        handlePercentileRoll();
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
    const clearTimer = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
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

// Combined handler for both double-click and long press
function handlePercentileRoll() {
  console.log("Triggering percentile roll");
  
  // Clear existing dice and set up percentile roll
  clearDice();
  state.selectedDice = ['d00'];
  console.log("Set up percentile roll, state:", state.selectedDice);
  
  // Roll and animate
  rollAndAnimate(['d00']);
}

function rollAndAnimate(dice) {
  try {
    // Roll the dice
    rollAllDice();
    
    // Animate the dice and results
    const durationMs = animateDiceIcons(dice);
    setTimeout(() => {
      try {
        // For percentile rolls, use lastTotal
        const total = state.lastTotal !== undefined ? 
          state.lastTotal : 
          state.currentRolls.reduce((sum, roll) => {
            // Handle both number rolls and percentile roll objects
            if (typeof roll === 'number') {
              return sum + roll;
            } else if (roll && roll.value) {
              // For percentile rolls, convert string values to numbers
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


