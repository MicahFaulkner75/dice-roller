/*
* CORE FUNCTIONS
*
* This file centralizes all fundamental dice rolling functionality of the application.
* It is responsible for providing a clean API for all dice operations, separated
* from UI concerns and trigger mechanisms. It now uses the state management API
* instead of directly manipulating state.
*
* This file:
* 1. Provides standard die rolling functions (rollSpecificDie, rollNonStandardDie)
* 2. Handles special percentile dice functionality (rollPercentileDie, activatePercentileMode)
* 3. Manages dice pool operations via state API (clearDicePool, rerollAllDice)
* 4. Processes modifiers through state API (adjustModifier, setModifierValue)
* 5. Processes dice notation input (processNotation)
* 6. Controls applet state and positioning (resetApplet, toggleApplet, minimizeApplet)
* 7. Coordinates animation sequences (animateDiceRoll)
*/

// Update imports to use new state API
import {
  // State management
  getSelectedDice, getCurrentRolls, getModifier, getLastTotal,
  hasPercentileDie, addDie, addRollResult, setRollResults,
  setModifier, clearDice, clearResults, resetState,
  // For backward compatibility during refactoring
  state
} from './state';

import { rollDie, rollAllDice, computeTotal, parseDiceNotation, rollPercentile } from './dice-logic';
import { animateDiceIcons, animateResults, resetD10State } from './animations/dice-animations';
import { updateDisplay, updateResults } from './ui/display';

/**
 * Check if a die type is a standard die (d4, d6, d8, d10, d12, d20)
 * @param {string} dieType - The type of die to check
 * @returns {boolean} Whether the die is standard
 */
function isStandardDie(dieType) {
  return ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType);
}

/**
 * Prepare display data for UI updates
 * @returns {Object} Data needed for display updates
 */
export function prepareDisplayData() {
  const selectedDice = getSelectedDice();
  const modifier = getModifier();
  const isPercentile = hasPercentileDie();
  
  return {
    selectedDice,
    modifier,
    isPercentile
  };
}

/**
 * Prepare results data for display and animation
 * @param {Array} results - Array of roll results
 * @param {Array} diceTypes - Array of dice types
 * @param {number} modifier - The modifier to apply
 * @returns {Object} Object containing formatted results data
 */
function prepareResultsData(results, diceTypes, modifier) {
  const standardResults = [];
  const nonStandardGroups = {};
  let total = modifier || 0;

  results.forEach((result, index) => {
    const dieType = diceTypes[index];
    total += result;

    if (isStandardDie(dieType)) {
      standardResults.push({
        value: result,
        dieType
      });
    } else {
      if (!nonStandardGroups[dieType]) {
        nonStandardGroups[dieType] = {
          count: 1,
          results: [result],
          subtotal: result
        };
      } else {
        nonStandardGroups[dieType].count++;
        nonStandardGroups[dieType].results.push(result);
        nonStandardGroups[dieType].subtotal += result;
      }
    }
  });

  return {
    standardResults,
    nonStandardGroups,
    modifier: modifier || 0,
    total
  };
}

/**
 * Prepare data for dice roll animations
 * @param {Array} results - Array of roll results
 * @param {Array} diceTypes - Array of dice types
 * @returns {Object} Data needed for roll animations
 */
function prepareAnimationData(results, diceTypes) {
  const standardRolls = [];
  let total = 0;

  results.forEach((result, index) => {
    const dieType = diceTypes[index];
    total += result;

    if (isStandardDie(dieType)) {
      standardRolls.push({
        value: result,
        dieType
      });
    }
  });

  return {
    rolls: standardRolls,
    diceTypes: diceTypes.filter(isStandardDie),
    total
  };
}

/**
 * Roll a specific standard die and add it to the dice pool
 * @param {string} dieType - The type of die to roll (e.g., 'd4', 'd6', 'd20')
 * @param {boolean} autoRoll - Whether to automatically roll the entire pool after adding
 * @returns {object} - Information about the roll for animation
 */
export function rollSpecificDie(dieType, autoRoll = true) {
  // Don't allow non-standard dice to be added via this function
  if (!['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType)) {
    console.warn(`Invalid standard die type: ${dieType}`);
    return false;
  }
  
  // Check if we have a percentile roll and clear it first
  if (hasPercentileDie()) {
    clearDicePool();
  }
  
  // Add die to pool
  addDie(dieType);
  updateDisplay(prepareDisplayData());
  
  if (autoRoll) {
    const { results } = rollAllDice();
    const diceTypes = getSelectedDice();
    const currentModifier = getModifier();
    
    const durationMs = animateDiceIcons([dieType]);
    animateResults(prepareAnimationData(results, diceTypes), durationMs);
    updateResults(prepareResultsData(results, diceTypes, currentModifier));
    return { results, total: computeTotal() };
  } else {
    const result = rollDie(parseInt(dieType.slice(1), 10));
    addRollResult(result);
    return { results: [result], total: computeTotal() };
  }
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
  updateDisplay(prepareDisplayData());
  
  // Roll the percentile die using existing logic
  const { results, total } = rollAllDice();
  
  const durationMs = animateDiceIcons(['d00']);
  animateResults(prepareAnimationData(results, getSelectedDice()), durationMs);
  updateResults(prepareResultsData(results, getSelectedDice(), getModifier()));
  
  return { results, total };
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
  if (hasPercentileDie()) {
    clearDicePool();
  }
  
  // Add custom die to pool
  const dieType = `d${sides}`;
  addDie(dieType);
  updateDisplay(prepareDisplayData());
  
  // Roll this individual die
  const result = rollDie(sides);
  addRollResult(result);
  
  const durationMs = animateDiceIcons([dieType]);
  animateResults(prepareAnimationData([result], [dieType]), durationMs);
  updateResults(prepareResultsData([result], [dieType], getModifier()));
  
  return {
    diceToAnimate: [dieType],
    results: [result],
    total: computeTotal()
  };
}

/**
 * Reroll all dice currently in the pool
 * @returns {object} - Information about the roll for animation
 */
export function rerollAllDice() {
  const diceToRoll = getSelectedDice();
  if (diceToRoll.length === 0) {
    console.warn("No dice in pool to reroll");
    return false;
  }
  
  // Clear current rolls but maintain selected dice
  clearResults();
  
  // Check for percentile dice
  if (hasPercentileDie()) {
    // Use the existing percentile roll function
    const { results } = rollAllDice();
    
    const durationMs = animateDiceIcons(diceToRoll);
    animateResults(prepareAnimationData(results, diceToRoll), durationMs);
    updateResults(prepareResultsData(results, diceToRoll, getModifier()));
    
    return {
      diceToAnimate: ['d00'],
      results: results,
      total: computeTotal()
    };
  } else {
    // Roll each die individually to maintain order
    const { results } = rollAllDice();
    
    const durationMs = animateDiceIcons(diceToRoll);
    animateResults(prepareAnimationData(results, diceToRoll), durationMs);
    updateResults(prepareResultsData(results, diceToRoll, getModifier()));
    
    return {
      diceToAnimate: diceToRoll,
      results: results,
      total: computeTotal()
    };
  }
}

/**
 * Clear the dice pool and reset all state
 */
export function clearDicePool() {
  clearDice();
  clearResults();
  resetD10State();
  // Update both displays with empty data
  updateDisplay(prepareDisplayData());
  updateResults({
    standardResults: [],
    nonStandardGroups: {},
    modifier: 0,
    total: 0
  });
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
  
  setModifier(getModifier() + amount);
  updateDisplay(prepareDisplayData());
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
  updateDisplay(prepareDisplayData());
}

/**
 * Process dice notation from user input
 * @param {string} notation - The dice notation to process (e.g., "2d6+1d8+3")
 * @returns {object|null} Information for animation, or null if invalid
 */
export function processNotation(notation) {
  if (!notation || typeof notation !== 'string') {
    console.warn('Invalid notation:', notation);
    return null;
  }
  
  // Define sets for percentile and non-standard notations
  const percentileSet = new Set(["d100", "d00", "00"]);
  const nonStandardSet = new Set(["1d100"]);

  // Special handling for exact standalone "d100" to ensure it still works as percentile
  if (percentileSet.has(notation.trim().toLowerCase())) {
    console.log('Exact percentile pattern detected, treating as percentile');
    
    // Clear the current dice pool
    clearDice();
    
    // Add a percentile die for d100 (using d00 internally)
    addDie('d00');
    
    // Roll the percentile die
    const { results } = rollAllDice();
    
    // Update display to show "00" in the input area
    updateDisplay(prepareDisplayData());
    
    return {
      diceToAnimate: ['d00'],
      results: results,
      total: computeTotal()
    };
  }
  
  // Check for non-standard dice patterns
  if (nonStandardSet.has(notation.trim().toLowerCase())) {
    console.log('Non-standard dice pattern detected: 1d100 -> converting to d100');
    
    // Clear the current dice pool
    clearDice();
    
    // Special case: convert 1d100 to d100 before adding
    const dieToAdd = 'd100';
    addDie(dieToAdd);
    
    // Roll the non-standard die
    const { results } = rollAllDice();
    
    // Update display
    updateDisplay(prepareDisplayData());
    
    return {
      diceToAnimate: [dieToAdd],
      results: results,
      total: computeTotal()
    };
  }
  
  // If it's not a special case, continue with normal parsing
  const parsed = parseDiceNotation(notation);
  if (!parsed) {
    console.warn('Could not parse notation:', notation);
    return null;
  }
  
  console.log('Parsed notation:', parsed);
  
  // Handle pure modifier input when dice are already in the pool
  if (parsed.type === 'modifier') {
    const currentDice = getSelectedDice();
    // Only update the modifier and leave dice as they are
    setModifier(parsed.modifier);
    
    // If we have dice in the pool, roll them with the new modifier
    if (currentDice.length > 0) {
      const { results } = rollAllDice();
      const durationMs = animateDiceIcons(currentDice);
      animateResults(prepareAnimationData(results, currentDice), durationMs);
      updateResults(prepareResultsData(results, currentDice, parsed.modifier));
      return { results, total: computeTotal() };
    }
    
    // No dice to roll, just update the display
    updateDisplay(prepareDisplayData());
    return null;
  }
  
  // Get current modifier before clearing
  const currentModifier = getModifier();
  
  // Clear the current dice pool
  clearDice();
  
  // Add the parsed dice to the pool in order
  const diceToRoll = [];
  const results = [];
  
  parsed.dice.forEach(die => {
    // Special handling for "1d100", convert to "d100"
    if (die.toLowerCase() === '1d100') {
      addDie('d100');
      diceToRoll.push('d100');
    } else {
      addDie(die);
      diceToRoll.push(die);
    }
  });
  
  // Add new modifier to the existing one (not replace)
  setModifier(currentModifier + parsed.modifier);
  
  // Check if this is a percentile roll after adding dice
  if (parsed.type === 'percentile') {
    // Use the dedicated percentile die function
    const { results } = rollAllDice();
    
    const durationMs = animateDiceIcons(['d00']);
    animateResults(prepareAnimationData(results, diceToRoll), durationMs);
    updateResults(prepareResultsData(results, diceToRoll, currentModifier + parsed.modifier));
    
    return {
      diceToAnimate: ['d00'],
      results: results,
      total: computeTotal()
    };
  } else {
    // For mixed and normal rolls, handle all dice normally
    // Roll each die individually to maintain order
    diceToRoll.forEach(die => {
      if (die === 'd00' || die === 'd100') {
        if (parsed.type === 'mixed') {
          // In mixed rolls, treat d00/d100 as a non-standard die
          const sides = 100;
          const result = rollDie(sides);
          results.push(result);
          addRollResult(result);
        } else {
          // Only use percentile handling in pure percentile rolls
          const percentileResult = rollPercentile();
          // Since rollPercentile returns all results directly, add them to our results
          // and to the state
          if (percentileResult.results) {
            results.push(...percentileResult.results);
            percentileResult.results.forEach(result => addRollResult(result));
          }
        }
      } else {
        // Handle regular die
        const sides = parseInt(die.slice(1), 10);
        const result = rollDie(sides);
        results.push(result);
        addRollResult(result);
      }
    });
    
    updateDisplay(prepareDisplayData());
    
    const durationMs = animateDiceIcons(diceToRoll);
    animateResults(prepareAnimationData(results, diceToRoll), durationMs);
    updateResults(prepareResultsData(results, diceToRoll, currentModifier + parsed.modifier));
    
    return {
      diceToAnimate: diceToRoll,
      results: results,
      total: computeTotal()
    };
  }
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
  animateResults({
    rolls: results,
    diceTypes: diceToAnimate,
    total
  }, durationMs);
  
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