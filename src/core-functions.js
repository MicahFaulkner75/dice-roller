/*
* CORE FUNCTIONS
*
* This file centralizes all fundamental dice rolling functionality of the application.
* It is responsible for providing a clean API for all dice operations, separated
* from UI concerns and trigger mechanisms.
*
* This file:
* 1. Provides standard die rolling functions (rollDie, rollSpecificDie)
* 2. Handles special percentile dice functionality (rollPercentileDie)
* 3. Manages state operations (addDieToPool, clearDicePool)
* 4. Processes modifiers (adjustModifier)
* 5. Manages text input parsing (processNotation)
* 6. Controls applet state (resetApplet)
* 7. Standardizes animation sequence (animateDiceRoll)
*/

import { state, setModifier, clearDice, clearResults, addDie } from './state';
import { rollDie, rollAllDice, computeTotal, parseDiceNotation } from './dice-logic';
import { animateDiceIcons, animateResults, resetD10State } from './animations/dice-animations';
import { updateDisplay } from './ui/display';

/**
 * Roll a specific standard die and add it to the dice pool
 * @param {string} dieType - The type of die to roll (e.g., 'd4', 'd6', 'd20')
 * @returns {object} - Information about the roll for animation
 */
export function rollSpecificDie(dieType) {
  // Don't allow non-standard dice to be added via this function
  if (!['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType)) {
    console.warn(`Invalid standard die type: ${dieType}`);
    return false;
  }
  
  // Check if we have a percentile roll and clear it first
  const hasPercentile = state.selectedDice.length === 1 && 
    (state.selectedDice[0] === 'd00' || state.selectedDice[0] === 'd100');
  
  if (hasPercentile) {
    clearDicePool();
  }
  
  // Add die to pool
  addDie(dieType);
  updateDisplay();
  
  // Roll this individual die
  const sides = parseInt(dieType.slice(1), 10);
  const result = rollDie(sides);
  
  // Update the state with this roll
  // (We're not using rollAllDice here as we just need this single die's result)
  state.currentRolls.push(result);
  
  // Return the dice to animate and the result
  return {
    diceToAnimate: [dieType],
    results: [result], 
    total: result + state.modifier
  };
}

/**
 * Roll a percentile die (d100/d00)
 * @returns {object} - Information about the roll for animation
 */
export function rollPercentileDie() {
  // Clear existing dice and set percentile mode
  clearDicePool();
  
  // Add percentile die to the pool
  addDie('d00');
  updateDisplay();
  
  // Roll the percentile die using existing logic
  rollAllDice();
  
  // Return animation info
  return {
    diceToAnimate: ['d00'],
    results: state.currentRolls,
    total: computeTotal()
  };
}

/**
 * Roll a non-standard die with the specified number of sides
 * @param {number} sides - Number of sides on the die
 * @returns {object} - Information about the roll for animation
 */
export function rollNonStandardDie(sides) {
  if (isNaN(sides) || sides < 1) {
    console.warn(`Invalid number of sides: ${sides}`);
    return false;
  }
  
  // Clear any percentile roll first
  const hasPercentile = state.selectedDice.length === 1 && 
    (state.selectedDice[0] === 'd00' || state.selectedDice[0] === 'd100');
  
  if (hasPercentile) {
    clearDicePool();
  }
  
  // Add custom die to pool
  const dieType = `d${sides}`;
  addDie(dieType);
  updateDisplay();
  
  // Roll this individual die
  const result = rollDie(sides);
  state.currentRolls.push(result);
  
  return {
    diceToAnimate: [dieType],
    results: [result],
    total: result + state.modifier
  };
}

/**
 * Reroll all dice currently in the pool
 * @returns {object} - Information about the roll for animation
 */
export function rerollAllDice() {
  if (state.selectedDice.length === 0) {
    console.warn("No dice in pool to reroll");
    return false;
  }
  
  // Use the existing roll function
  rollAllDice();
  
  return {
    diceToAnimate: state.selectedDice,
    results: state.currentRolls,
    total: computeTotal()
  };
}

/**
 * Clear the dice pool and reset all state
 */
export function clearDicePool() {
  clearDice();
  clearResults();
  resetD10State();
  updateDisplay();
}

// Add a variable to store the last position of the applet
const defaultAppletPosition = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
};

// Variable to track the last position before minimizing
let lastPosition = {
  left: defaultAppletPosition.left,
  top: defaultAppletPosition.top,
  transform: defaultAppletPosition.transform
};

/**
 * Center the applet in the viewport
 */
export function centerApplet() {
  const applet = document.getElementById('dice-applet');
  if (applet) {
    applet.style.left = defaultAppletPosition.left;
    applet.style.top = defaultAppletPosition.top;
    applet.style.transform = defaultAppletPosition.transform;
    
    // Update last position
    lastPosition = {
      left: applet.style.left,
      top: applet.style.top,
      transform: applet.style.transform
    };
  }
}

/**
 * Show the applet without changing its position
 */
export function showApplet() {
  const applet = document.getElementById('dice-applet');
  if (applet) {
    applet.style.display = 'flex';
    return true;
  }
  return false;
}

/**
 * Enhanced version of minimizeApplet that properly saves state
 */
export function minimizeApplet() {
  const applet = document.getElementById('dice-applet');
  if (applet) {
    // Store current position before hiding
    lastPosition = {
      left: applet.style.left || defaultAppletPosition.left,
      top: applet.style.top || defaultAppletPosition.top,
      transform: applet.style.transform || defaultAppletPosition.transform
    };
    
    // Hide the applet
    applet.style.display = 'none';
    return true;
  }
  return false;
}

/**
 * Enhanced toggle function with position management
 * @param {boolean} centerIfShowing - Whether to center the applet when showing
 * @returns {boolean} - Whether the applet is now visible
 */
export function toggleApplet(centerIfShowing = false) {
  const applet = document.getElementById('dice-applet');
  if (applet) {
    const isHidden = applet.style.display === 'none';
    
    if (isHidden) {
      // Show the applet
      applet.style.display = 'flex';
      
      // Center if requested, otherwise restore to last position
      if (centerIfShowing) {
        centerApplet();
      } else {
        // Restore previous position
        applet.style.left = lastPosition.left;
        applet.style.top = lastPosition.top;
        applet.style.transform = lastPosition.transform;
      }
      
      return true; // Now visible
    } else {
      // Save position before hiding
      lastPosition = {
        left: applet.style.left || defaultAppletPosition.left,
        top: applet.style.top || defaultAppletPosition.top,
        transform: applet.style.transform || defaultAppletPosition.transform
      };
      
      // Hide the applet
      applet.style.display = 'none';
      return false; // Now hidden
    }
  }
  return false;
}

/**
 * Enhanced reset applet function that standardizes the reset process
 * @param {boolean} clearAll - Whether to clear all state (dice, modifier, etc.)
 * @param {boolean} centerPosition - Whether to center the applet
 * @param {boolean} hideApplet - Whether to hide the applet after reset
 */
export function resetApplet(clearAll = true, centerPosition = true, hideApplet = true) {
  // Clear dice pool and results if requested
  if (clearAll) {
    clearDicePool();
    
    // Reset modifier to 0
    setModifier(0);
    updateDisplay();
    
    // Reset d10 percentile state
    resetD10State();
  }
  
  // Reset position if requested
  if (centerPosition) {
    centerApplet();
  }
  
  // Hide applet if requested
  if (hideApplet) {
    minimizeApplet();
  }
}

/**
 * Adjust the modifier value
 * @param {number} amount - The amount to adjust by (positive or negative)
 */
export function adjustModifier(amount) {
  if (isNaN(amount)) {
    console.warn(`Invalid modifier adjustment: ${amount}`);
    return;
  }
  
  setModifier(state.modifier + amount);
  updateDisplay();
}

/**
 * Set the modifier to a specific value
 * @param {number} value - The new modifier value
 */
export function setModifierValue(value) {
  if (isNaN(value)) {
    console.warn(`Invalid modifier value: ${value}`);
    return;
  }
  
  setModifier(value);
  updateDisplay();
}

/**
 * Process dice notation text input
 * @param {string} notation - The dice notation to process (e.g., "2d6+1")
 * @returns {object|boolean} - Information about the roll for animation, or false if invalid
 */
export function processNotation(notation) {
  if (!notation) {
    clearDicePool();
    return false;
  }
  
  const parsed = parseDiceNotation(notation);
  if (!parsed) {
    console.warn(`Invalid dice notation: ${notation}`);
    return false;
  }
  
  // Clear current state
  clearDicePool();
  
  // If this is just a modifier, set it and return
  if (parsed.type === 'modifier') {
    setModifier(parsed.modifier);
    updateDisplay();
    return false; // No roll to animate
  }
  
  // Add the parsed dice to the pool
  parsed.dice.forEach(die => addDie(die));
  
  // Set modifier
  setModifier(parsed.modifier);
  
  // Roll the dice
  rollAllDice();
  
  return {
    diceToAnimate: parsed.dice,
    results: state.currentRolls,
    total: computeTotal()
  };
}

/**
 * Unified function to animate dice rolls
 * @param {object} rollInfo - The roll information from one of the roll functions
 * @returns {number} - The animation duration in milliseconds
 */
export function animateDiceRoll(rollInfo) {
  if (!rollInfo) return 0;
  
  const { diceToAnimate, results, total } = rollInfo;
  
  // Start animation sequence
  const durationMs = animateDiceIcons(diceToAnimate);
  animateResults(results, total, durationMs);
  
  return durationMs;
}

/**
 * Activates percentile mode on the d10 die
 */
export function activatePercentileMode() {
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  if (!d10Button) return false;
  
  // Clear existing dice and set up percentile roll
  clearDicePool();
  addDie('d00');
  updateDisplay();
  
  const isFirstActivation = !d10Button.classList.contains('percentile-active');
  
  if (isFirstActivation) {
    // First activation setup
    d10Button.classList.remove('percentile-active');
    void d10Button.offsetWidth;
    d10Button.classList.add('percentile-active', 'first-animation');
    
    if (!d10Button.classList.contains('has-rolled-once')) {
      d10Button.classList.add('has-rolled-once');
    }
  }
  
  // Roll and get animation info
  return rollPercentileDie();
} 