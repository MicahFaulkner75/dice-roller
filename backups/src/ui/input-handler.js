/*
* INPUT HANDLER
*
* This file manages all user input for dice notation and keyboard interactions.
* It is responsible for setting up the input field, processing text input,
* handling all keyboard shortcuts, and triggering rolls based on user input.
* All state operations are performed using the core-functions API rather than
* direct state manipulation.
*
* This file:
* 1. Sets up the editable input field (setupDiceInput)
* 2. Manages all keyboard events application-wide
* 3. Processes text input for dice notation
* 4. Prevents event propagation for text selection
* 5. Handles keyboard shortcuts for clearing number input (ESC, Backspace)
* 6. Adheres to state management architecture by using core functions API
*
* Last updated: March 19, 2025
*/

import { 
  processNotation, 
  clearDicePool, 
  rerollAllDice, 
  resetApplet, 
  minimizeApplet,
  setModifierValue,
  animateDiceRoll,
  toggleApplet
} from '../core-functions';

import { clearNumberValue } from '../number-buttons';

/**
 * Sets up the dice input field and global keyboard handling
 */
export function setupDiceInput() {
  const diceInputEl = document.getElementById('dice-input');
  diceInputEl.contentEditable = 'true';
  diceInputEl.draggable = false;
  
  // Prevent text selection from triggering minimization
  diceInputEl.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
  
  diceInputEl.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Set up input-specific keyboard handling
  diceInputEl.addEventListener('keydown', handleInputKeyDown);
  
  // No specific action needed on blur
  diceInputEl.addEventListener('blur', () => {});

  // Set up global keyboard handlers
  setupGlobalKeyboardHandlers(diceInputEl);
  
  // console.log("Input handler setup with centralized keyboard handling"); // find_me
}

/**
 * Sets up all global keyboard shortcuts for the application
 * @param {HTMLElement} diceInput - The dice input element to check focus against
 */
function setupGlobalKeyboardHandlers(diceInput) {
  document.addEventListener('keydown', (e) => {
    // Get the active element once
    const activeElement = document.activeElement;
    const isInputFocused = activeElement === diceInput;
    
    // Handle different keys based on context
    switch (e.key) {
      case 'Enter':
        // When input is focused, let the input handler deal with it
        if (isInputFocused) return;
        
        e.preventDefault();
        // Use core function to reroll dice and animate
        const rollInfo = rerollAllDice();
        if (rollInfo) {
          animateDiceRoll(rollInfo);
        }
        break;
        
      case 'Backspace':
        // When input is focused, let the browser handle it
        if (isInputFocused) return;
        
        e.preventDefault();
        // Use core function to clear pool and reset modifier
        clearDicePool();
        setModifierValue(0);
        break;
        
      case 'Escape':
        e.preventDefault();
        
        // When input is focused, just blur it (don't clear)
        if (isInputFocused) {
          diceInput.blur();
          return;
        }
        
        // Full applet reset (includes minimize, reposition, clear everything)
        resetApplet(true); // true flag indicates full reset with minimize
        break;
        
      // Add space key to toggle the applet visibility
      case ' ':
        // Only if not in input field
        if (isInputFocused) return;
        
        e.preventDefault();
        toggleApplet(false); // Don't center when toggling to preserve position
        break;
        // TODO: REMINDER - Consider removing the space key shortcut before website deployment
        // This might conflict with native scrolling or other website functionality
    }
  });
  
  // console.log("Global keyboard handlers have been set up"); // find_me
}

/**
 * Handles keyboard events specifically within the input field
 */
function handleInputKeyDown(e) {
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      e.stopPropagation();
      const input = e.target.textContent.trim();
      
      // Use core function to process notation and animate
      const rollInfo = processNotation(input);
      if (rollInfo) {
        animateDiceRoll(rollInfo);
      }
      e.target.blur();
      break;
      
    case 'Escape':
      e.preventDefault();
      e.stopPropagation();
      // Just blur the input, don't clear anything
      e.target.blur();
      break;
  }
}

/**
 * Sets up the roll button click handler
 * This is called from ui-updates.js
 */
export function setupRollButton() {
  const rollButtonEl = document.getElementById('roll-button');
  if (rollButtonEl) {
    rollButtonEl.addEventListener('click', () => {
      // Use core function to reroll and animate
      const rollInfo = rerollAllDice();
      if (rollInfo) {
        animateDiceRoll(rollInfo);
      }
    });
    // console.log("Roll button handler set up"); // find_me
  }
}
