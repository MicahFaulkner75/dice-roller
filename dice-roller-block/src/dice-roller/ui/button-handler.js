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
  animateDiceRoll,
  prepareDisplayData
} from '../core-functions';

import { updateDisplay } from './display';
import { getCurrentNumberValue, clearNumberValue } from '../number-buttons';
import { addDie, getSelectedDice, setFudgeMode, hasPercentileDie } from '../state';
import { hideHelpPopup } from '../help';

/**
 * Exit percentile mode by cleaning up visual states only
 * State cleanup is handled by clearDicePool
 * @param {HTMLElement} d10Button - The d10 button element
 */
function exitPercentileMode(d10Button) {
    if (!d10Button) return;
    
    // Remove percentile-specific classes
    d10Button.classList.remove('percentile-active');
    d10Button.classList.remove('percentile-tens');
    d10Button.classList.remove('percentile-ones');
    
    // Show the main d10 face again
    const d10Face = d10Button.querySelector('.d10-face');
    if (d10Face) {
        d10Face.style.opacity = '1';
    }
    
    // Reset colored dice opacity without affecting spin states
    const coloredDice = d10Button.querySelectorAll('.colored-die');
    coloredDice.forEach(die => {
        die.style.opacity = '0';
    });
}

/**
 * Main setup function called from index.js to initialize all UI event handlers
 */
export function setupEventListeners() {
  // Set up input area event handlers
  const diceInput = document.getElementById('dice-input');
  diceInput.addEventListener('keydown', handleInputKeyDown);

  // Add global ESC key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // If we're in percentile mode, clear it
      if (hasPercentileDie()) {
        const d10Button = document.querySelector('.die-button[data-die="d10"]');
        clearDicePool();  // Handle state cleanup
        exitPercentileMode(d10Button);  // Handle visual cleanup
        e.preventDefault();
      }
    }
  });

  // Set up button click handlers
  setupControlButtons();
  
  // Set up click-outside behavior
  setupClickOutsideBehavior();
  
  // Set up fudge dice buttons
  setupFudgeButtons();
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
    const longPressDelay = 350;   // ms to trigger long press (iOS standard)
    let isLongPress = false;      // Track if we're handling a long press
    let isDoubleClick = false;    // Track if we're handling a double click
    
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
      
      // Handle shift-click for d10
      if (e.shiftKey && button.dataset.die === 'd10') {
        e.preventDefault();
        e.stopPropagation();
        const rollInfo = triggerPercentileRoll('shift-click');
        animateDiceRoll(rollInfo);
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
      // Start the long press timer
      pressTimer = setTimeout(() => {
        isLongPress = true;
        
        // Use unified trigger for percentile mode
        if (button.dataset.die === 'd10') {
          const rollInfo = triggerPercentileRoll('long-press');
          animateDiceRoll(rollInfo);
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
          animateDiceRoll(rollInfo);
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
}

/**
 * Handle single-click on a die button
 * @param {HTMLElement} button - The clicked button element
 */
function handleDieClick(button) {
    const dieType = button.dataset.die;
    
    // Check if we need to exit percentile mode
    if (hasPercentileDie()) {
        const d10Button = document.querySelector('.die-button[data-die="d10"]');
        clearDicePool();  // Handle state cleanup
        exitPercentileMode(d10Button);  // Handle visual cleanup
    }

    // Add visual feedback (temporary click effect)
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 150);
    
    // Get the current number value for multi-dice input
    const numValue = getCurrentNumberValue();
    
    // If we have a number selected, add that many dice
    if (numValue) {
        // Parse the number (valid range: 1-99)
        const quantity = parseInt(numValue, 10);
        
        if (!isNaN(quantity) && quantity > 0 && quantity <= 99) {
            // Add the specified number of dice
            for (let i = 0; i < quantity; i++) {
                addDie(dieType);
            }
            
            // Roll all dice in the pool
            const rollInfo = rerollAllDice();
            
            // Update the display with animation
            if (rollInfo) {
                const durationMs = animateDiceRoll(rollInfo);
            }
            
            // Clear the number input
            clearNumberValue();
        } else {
            // Handle invalid number (fallback to default behavior)
            const rollInfo = rollSpecificDie(dieType, true);
            if (rollInfo) {
                const durationMs = animateDiceRoll(rollInfo);
            }
        }
    } else {
        // Default behavior: roll a single die
        const rollInfo = rollSpecificDie(dieType, true);
        
        // Start animation if rollInfo is returned
        if (rollInfo) {
            const durationMs = animateDiceRoll(rollInfo);
        }
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
      // Also close help popup if it's open
      hideHelpPopup();
    });
  }
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
        // Also close help popup if it's open
        hideHelpPopup();
      }
    }
  });
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
  const criticalButton = document.querySelector('.fudge-button.critical');
  const highButton = document.querySelector('.fudge-button.high');
  const lowButton = document.querySelector('.fudge-button.low');
  const minimumButton = document.querySelector('.fudge-button.minimum');
  
  // Revised button functionality:
  // Red (critical) -> critical success
  if (criticalButton) {
    criticalButton.addEventListener('click', () => {
      setFudgeMode('critical');
    });
  }
  
  // Green (minimum) -> high roll
  if (minimumButton) {
    minimumButton.addEventListener('click', () => {
      setFudgeMode('high');
    });
  }
  
  // Orange (high) -> low roll
  if (highButton) {
    highButton.addEventListener('click', () => {
      setFudgeMode('low');
    });
  }
  
  // Blue (low) -> critical failure
  if (lowButton) {
    lowButton.addEventListener('click', () => {
      setFudgeMode('minimum');
    });
  }
  
  // Add keyboard shortcut for debug mode (Ctrl+Shift+F)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      const applet = document.getElementById('dice-applet');
      applet.classList.toggle('debug-fudge');
      e.preventDefault();
    }
  });
}


