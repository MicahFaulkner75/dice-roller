/*
* BUTTON HANDLER
*
* This file manages all UI button interactions and their associated behaviors.
* It is responsible for handling button clicks, different interaction types 
* (single, double, long press), and connecting UI actions to core functions.
* All state operations are performed using the core-functions API rather than
* direct state manipulation.
*
* This file:
* 1. Sets up dice button interactions (setupDiceButtons)
* 2. Sets up control button handlers (clear, roll, modifier, close)
* 3. Manages complex interactions (single-click, double-click, long-press)
* 4. Handles applet close behavior (click-outside)
* 5. Maps all button interactions to core functions
* 6. Integrates number button input with dice functionality
* 7. Allows adding multiple dice based on number input
* 8. Manages GM fudge dice button interactions
* 9. Adheres to state management architecture by using core functions API
*
* Last updated: March 20, 2025
*/

import { 
  // Dice functions
  rollSpecificDie, 
  rollPercentileDie,
  activatePercentileMode,
  triggerPercentileRoll,
  
  // Pool management
  clearDicePool,
  rerollAllDice,
  
  // Modifier management
  adjustModifier, 
  setModifierValue,
  
  // Notation processing
  processNotation,
  
  // Applet management
  minimizeApplet,
  
  // Animation
  animateDiceRoll
} from '../core-functions';

import { updateDisplay } from './display';
import { prepareDisplayData } from '../core-functions';
import { getCurrentNumberValue, clearNumberValue } from '../number-buttons';
import { addDie, getSelectedDice, setFudgeMode } from '../state';
import { hideHelpPopup } from '../help';

// Update variable names to use 'El' suffix
const diceInputEl = document.getElementById('dice-input');
const dieButtonsEl = document.querySelectorAll('.die-button');
const clearButtonEl = document.getElementById('clear-button');
const rollButtonEl = document.getElementById('roll-button');
const increaseButtonEl = document.getElementById('modify-button-increase');
const decreaseButtonEl = document.getElementById('modify-button-decrease');
const closeButtonEl = document.getElementById('close-applet');
const appletEl = document.getElementById('dice-applet');
const launchButtonEl = document.getElementById('dice-roller-button');
const criticalButtonEl = document.querySelector('.fudge-button.critical');
const highButtonEl = document.querySelector('.fudge-button.high');
const lowButtonEl = document.querySelector('.fudge-button.low');
const minimumButtonEl = document.querySelector('.fudge-button.minimum');

/**
 * Main setup function called from index.js to initialize all UI event handlers
 */
export function setupEventListeners() {
  // Set up input area event handlers
  if (diceInputEl) {
    diceInputEl.addEventListener('keydown', handleInputKeyDown);
  }

  // Set up button click handlers
  setupControlButtons();
  
  // Set up click-outside behavior
  setupClickOutsideBehavior();
  
  // Set up fudge dice buttons
  setupFudgeButtons();
  
  console.log("UI button handlers have been set up");
}

// ============================================================
// DICE BUTTONS SECTION
// ============================================================

/**
 * Sets up all dice button event listeners and interactions
 * This is exported for use in ui-updates.js
 */
export function setupDiceButtons() {
  let isLongPress = false;
  let isDoubleClick = false;
  let lastClickTime = 0;
  const doubleClickDelay = 300;
  const longPressDelay = 350; // Updated to 350ms as discussed
  
  dieButtonsEl.forEach(button => {
    let pressTimer;
    
    button.addEventListener('click', (e) => {
      // Always prevent click if it was a long press
      if (isLongPress) {
        e.preventDefault();
        e.stopPropagation();
        isLongPress = false;
        return;
      }
      
      const currentTime = Date.now();
      
      // Handle shift-click for d10
      if (e.shiftKey && button.dataset.die === 'd10') {
        e.preventDefault();
        e.stopPropagation();
        const rollInfo = triggerPercentileRoll('shift-click');
        if (rollInfo) {
          // Use new animation system alongside CSS
          animateDiceRoll(rollInfo);
        }
        return;
      }
      
      if (currentTime - lastClickTime < doubleClickDelay) {
        // Double click detected
        e.preventDefault();
        e.stopPropagation();
        isDoubleClick = true;
        
        // Use unified trigger for percentile mode
        if (button.dataset.die === 'd10') {
          const rollInfo = triggerPercentileRoll('double-click');
          if (rollInfo) {
            // Use new animation system alongside CSS
            animateDiceRoll(rollInfo);
          }
        }
        
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
      // Start the long press timer
      pressTimer = setTimeout(() => {
        isLongPress = true;
        
        // Use unified trigger for percentile mode
        if (button.dataset.die === 'd10') {
          const rollInfo = triggerPercentileRoll('long-press');
          if (rollInfo) {
            // Use new animation system alongside CSS
            animateDiceRoll(rollInfo);
          }
        }
        
        // Prevent any click events from firing
        e.preventDefault();
        e.stopPropagation();
      }, longPressDelay);
    });
    
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();  // Prevent touch event from triggering click
      pressTimer = setTimeout(() => {
        isLongPress = true;
        
        // Use unified trigger for percentile mode
        if (button.dataset.die === 'd10') {
          const rollInfo = triggerPercentileRoll('long-press');
          if (rollInfo) {
            // Use new animation system alongside CSS
            animateDiceRoll(rollInfo);
          }
        }
      }, longPressDelay);
    }, { passive: false });
    
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
  
  console.log("Dice button handlers initialized");
}

/**
 * Handle single-click on a die button
 * @param {HTMLElement} button - The clicked button element
 */
export function handleDieClick(button) {
  const dieType = button.dataset.die;
  // console.log(`Die click: ${dieType}`); // find_me
  
  // Add visual feedback (temporary click effect)
  button.classList.add('clicked');
  setTimeout(() => {
    button.classList.remove('clicked');
  }, 150);
  
  // Check if there's a value in the number display
  const numValue = getCurrentNumberValue();
  // console.log(`Current number value: "${numValue}"`); // find_me
  
  let rollInfo;
  
  if (numValue && numValue.length > 0) {
    // Use the number as a quantity for the die
    const quantity = parseInt(numValue, 10);
    
    if (!isNaN(quantity) && quantity > 0) {
      // console.log(`Adding ${quantity} ${dieType} dice to pool`); // find_me
      
      // Add the specified number of dice to the EXISTING pool
      // (no longer clearing the dice pool first)
      for (let i = 0; i < quantity; i++) {
        addDie(dieType);
      }
      
      // Update display based on the new dice selection
      const selectedDice = getSelectedDice();
      updateDisplay({
        selectedDice,
        modifier: 0,
        isPercentile: false
      });
      
      // Roll all dice
      rollInfo = rerollAllDice();
    } else {
      // console.log(`Invalid number value: ${numValue}, using default behavior`); // find_me
      // Fall back to default behavior if number is invalid
      rollInfo = rollSpecificDie(dieType);
    }
    
    // Clear the number display after adding dice
    clearNumberValue();
  } else {
    // No number value, use standard behavior
    // console.log(`No number value, using default behavior`); // find_me
    rollInfo = rollSpecificDie(dieType);
  }
  
  // Make sure we pass the roll info to animateDiceRoll to properly coordinate animations
  if (rollInfo) {
    // console.log(`Calling animateDiceRoll with roll info`); // find_me
    const durationMs = animateDiceRoll(rollInfo);
    // console.log(`animateDiceRoll returned duration: ${durationMs}ms`); // find_me
  } else {
    // console.warn(`rollSpecificDie returned falsy value, not calling animateDiceRoll`); // find_me
  }
}

// ============================================================
// CONTROL BUTTONS SECTION
// ============================================================

/**
 * Sets up all control button click handlers
 */
export function setupControlButtons() {
  // console.log('Setting up control buttons'); // find_me
  
  // Clear button
  if (clearButtonEl) {
    clearButtonEl.addEventListener('click', () => {
      // console.log('Clear button clicked'); // find_me
      // Use core function to clear dice pool
      clearDicePool();
      // Reset modifier to 0
      setModifierValue(0);
      // Also clear the number display
      clearNumberValue();
    });
  }

  // Roll button
  if (rollButtonEl) {
    rollButtonEl.addEventListener('click', () => {
      // Use core functions to reroll dice and animate
      const rollInfo = rerollAllDice();
      if (rollInfo) {
        animateDiceRoll(rollInfo);
      }
    });
  }

  // Modifier buttons
  if (increaseButtonEl) {
    increaseButtonEl.addEventListener('click', () => {
      // Use core function to adjust modifier
      adjustModifier(1);
    });
  }

  if (decreaseButtonEl) {
    decreaseButtonEl.addEventListener('click', () => {
      // Use core function to adjust modifier
      adjustModifier(-1);
    });
  }
  
  // Close button (X)
  if (closeButtonEl) {
    closeButtonEl.addEventListener('click', () => {
      // Use core function to minimize the applet without resetting state
      minimizeApplet();
      // Also close help popup if it's open
      hideHelpPopup();
    });
  }
  
  console.log("Control button handlers initialized");
}

// ============================================================
// APPLET BEHAVIOR SECTION
// ============================================================

/**
 * Sets up behavior for clicking outside the applet
 */
function setupClickOutsideBehavior() {
  let mouseDownTarget = null;
  let mouseDownTime = 0;
  const CLICK_THRESHOLD_MS = 300; // Threshold for what counts as a "quick click"

  document.addEventListener('mousedown', (e) => {
    mouseDownTarget = e.target;
    mouseDownTime = Date.now();
  });

  document.addEventListener('click', (e) => {
    // Only process if applet is visible
    if (appletEl && appletEl.style.display !== 'none') {
      // Check if this was a quick click (not a text selection)
      const isQuickClick = Date.now() - mouseDownTime < CLICK_THRESHOLD_MS;
       
      // Don't minimize if:
      // 1. Click is inside applet
      // 2. Click is on launch button
      // 3. Click started in input area (text selection)
      // 4. Click ended in input area (text selection)
      // 5. Not a quick click (likely text selection)
      if (!appletEl.contains(e.target) && 
          !launchButtonEl.contains(e.target) && 
          !diceInputEl.contains(mouseDownTarget) &&
          !diceInputEl.contains(e.target) &&
          isQuickClick) {
        // Use core function to minimize the applet
        minimizeApplet();
        // Also close help popup if it's open
        hideHelpPopup();
      }
    }
  });
  
  console.log("Click-outside behavior initialized");
}

/**
 * Handles Enter key press in the input field
 * Processes dice notation and triggers roll animations
 */
function handleInputKeyDown(e) {
  if (e.key !== 'Enter') return;

  e.preventDefault();
  const input = e.target.textContent.trim();
  
  // Use core function to process notation and animate
  const rollInfo = processNotation(input);
  if (rollInfo) {
    animateDiceRoll(rollInfo);
  }
}

/**
 * Set up the fudge dice buttons for GM use
 * These are invisible buttons that influence roll outcomes
 */
function setupFudgeButtons() {
  // Revised button functionality:
  // Red (critical) -> critical success
  if (criticalButtonEl) {
    criticalButtonEl.addEventListener('click', () => {
      console.log('Fudge mode: critical success');
      setFudgeMode('critical');
    });
  }
  
  // Green (minimum) -> high roll
  if (minimumButtonEl) {
    minimumButtonEl.addEventListener('click', () => {
      console.log('Fudge mode: high roll');
      setFudgeMode('high');
    });
  }
  
  // Orange (high) -> low roll
  if (highButtonEl) {
    highButtonEl.addEventListener('click', () => {
      console.log('Fudge mode: low roll');
      setFudgeMode('low');
    });
  }
  
  // Blue (low) -> critical failure
  if (lowButtonEl) {
    lowButtonEl.addEventListener('click', () => {
      console.log('Fudge mode: critical failure');
      setFudgeMode('minimum');
    });
  }
  
  // Add keyboard shortcut for debug mode (Ctrl+Shift+F)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      const applet = document.getElementById('dice-applet');
      applet.classList.toggle('debug-fudge');
      console.log('Fudge debug mode:', applet.classList.contains('debug-fudge') ? 'ON' : 'OFF');
      e.preventDefault();
    }
  });
  
  console.log("Fudge button handlers initialized");
}


