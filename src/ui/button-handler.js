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
* 6. Adheres to state management architecture by using core functions API
*/

import { 
  // Dice functions
  rollSpecificDie, 
  rollPercentileDie,
  activatePercentileMode,
  
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
import { addDie, getSelectedDice } from '../state';

/**
 * Main setup function called from index.js to initialize all UI event handlers
 */
export function setupEventListeners() {
  // Set up input area event handlers
  const diceInput = document.getElementById('dice-input');
  diceInput.addEventListener('keydown', handleInputKeyDown);

  // Set up button click handlers
  setupControlButtons();
  
  // Set up click-outside behavior
  setupClickOutsideBehavior();
  
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
        
        // Use core function for percentile mode
        if (button.dataset.die === 'd10') {
          const rollInfo = activatePercentileMode();
          animateDiceRoll(rollInfo);
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
      if (e.target.closest('button') || e.target.closest('.input-row')) return;
      pressTimer = setTimeout(() => {
        isLongPress = true;
        
        // Use core function for percentile mode
        if (button.dataset.die === 'd10') {
          const rollInfo = activatePercentileMode();
          animateDiceRoll(rollInfo);
        }
        
        // Prevent any click events from firing
        e.preventDefault();
        e.stopPropagation();
      }, 500);
    });
    
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();  // Prevent touch event from triggering click
      pressTimer = setTimeout(() => {
        isLongPress = true;
        
        // Use core function for percentile mode
        if (button.dataset.die === 'd10') {
          const rollInfo = activatePercentileMode();
          animateDiceRoll(rollInfo);
        }
      }, 500);
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
function handleDieClick(button) {
  const dieType = button.dataset.die;
  console.log(`[DEBUG] ${dieType} button clicked - starting handleDieClick`);
  
  // Add visual feedback (temporary click effect)
  button.classList.add('clicked');
  setTimeout(() => {
    button.classList.remove('clicked');
  }, 150);
  
  // Check if there's a value in the number display
  const numValue = getCurrentNumberValue();
  console.log(`[DEBUG] Current number value: "${numValue}"`);
  
  let rollInfo;
  
  if (numValue && numValue.length > 0) {
    // Use the number as a quantity for the die
    const quantity = parseInt(numValue, 10);
    
    if (!isNaN(quantity) && quantity > 0) {
      console.log(`[DEBUG] Adding ${quantity} ${dieType} dice to pool`);
      
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
      console.log(`[DEBUG] Invalid number value: ${numValue}, using default behavior`);
      // Fall back to default behavior if number is invalid
      rollInfo = rollSpecificDie(dieType);
    }
    
    // Clear the number display after adding dice
    clearNumberValue();
  } else {
    // No number value, use standard behavior
    console.log(`[DEBUG] No number value, using default behavior`);
    rollInfo = rollSpecificDie(dieType);
  }
  
  // Make sure we pass the roll info to animateDiceRoll to properly coordinate animations
  if (rollInfo) {
    console.log(`[DEBUG] Calling animateDiceRoll with roll info`);
    const durationMs = animateDiceRoll(rollInfo);
    console.log(`[DEBUG] animateDiceRoll returned duration: ${durationMs}ms`);
  } else {
    console.warn(`[DEBUG] rollSpecificDie returned falsy value, not calling animateDiceRoll`);
  }
}

// ============================================================
// CONTROL BUTTONS SECTION
// ============================================================

/**
 * Sets up all control button click handlers
 */
function setupControlButtons() {
  // Clear button
  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', () => {
    // Use core function to clear dice pool
    clearDicePool();
    // Reset modifier to 0
    setModifierValue(0);
    // Also clear the number display
    clearNumberValue();
  });

  // Roll button
  const rollButton = document.getElementById('roll-button');
  rollButton.addEventListener('click', () => {
    // Use core functions to reroll dice and animate
    const rollInfo = rerollAllDice();
    if (rollInfo) {
      animateDiceRoll(rollInfo);
    }
  });

  // Modifier buttons
  const increaseButton = document.getElementById('modify-button-increase');
  increaseButton.addEventListener('click', () => {
    // Use core function to adjust modifier
    adjustModifier(1);
  });

  const decreaseButton = document.getElementById('modify-button-decrease');
  decreaseButton.addEventListener('click', () => {
    // Use core function to adjust modifier
    adjustModifier(-1);
  });
  
  // Close button (X)
  const closeButton = document.getElementById('close-applet');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      // Use core function to minimize the applet without resetting state
      minimizeApplet();
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
    const applet = document.getElementById('dice-applet');
    const launchButton = document.getElementById('dice-roller-button');
    const diceInput = document.getElementById('dice-input');
     
    // Only process if applet is visible
    if (applet && applet.style.display !== 'none') {
      // Check if this was a quick click (not a text selection)
      const isQuickClick = Date.now() - mouseDownTime < CLICK_THRESHOLD_MS;
       
      // Don't minimize if:
      // 1. Click is inside applet
      // 2. Click is on launch button
      // 3. Click started in input area (text selection)
      // 4. Click ended in input area (text selection)
      // 5. Not a quick click (likely text selection)
      if (!applet.contains(e.target) && 
          !launchButton.contains(e.target) && 
          !diceInput.contains(mouseDownTarget) &&
          !diceInput.contains(e.target) &&
          isQuickClick) {
        // Use core function to minimize the applet
        minimizeApplet();
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


