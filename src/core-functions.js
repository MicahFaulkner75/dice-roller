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
  // Animation display state
  clearAnimationSubtotals,
  // For backward compatibility during refactoring
  state
} from './state';

import { rollDie, rollAllDice, computeTotal, parseDiceNotation, rollPercentile } from './dice-logic';
import { animateDiceIcons, animateResults, resetD10State, animateD10 } from './animations/dice-animations';
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
 * Prepare results data for display
 * @param {Array} results - Array of roll results
 * @param {Array} diceTypes - Array of dice types
 * @param {number} modifier - Modifier to apply to total
 * @returns {Object} Formatted results data
 */
export function prepareResultsData(results, diceTypes, modifier) {
  console.log('=== DEBUG: prepareResultsData ===');
  console.log('Input results:', results);
  console.log('Input diceTypes:', diceTypes);
  console.log('Input modifier:', modifier);
  
  const standardResults = [];
  const nonStandardGroups = {};
  let total = modifier || 0;
  
  console.log('Starting total (modifier):', total);
  
  results.forEach((result, index) => {
    const dieType = diceTypes[index];
    console.log(`Processing die ${index}: ${dieType}`);
    
    // Handle percentile results (which come as objects with type and value)
    if (result && typeof result === 'object' && 'type' in result) {
      // This is a percentile component - treat as standard die
      standardResults.push({
        value: result,  // Pass the entire object to preserve type and value
        dieType: 'd00'  // Mark as percentile
      });
      // Don't add to total here - it's handled separately in computeTotal
    } else {
      // Handle regular dice results
      if (isStandardDie(dieType)) {
        standardResults.push({
          value: result,
          dieType
        });
        total += result;
        console.log(`Added standard die ${dieType} = ${result}`);
      } else {
        if (!nonStandardGroups[dieType]) {
          nonStandardGroups[dieType] = {
            count: 1,
            results: [result],
            subtotal: result
          };
          console.log(`Created new non-standard group for ${dieType}, subtotal = ${result}`);
        } else {
          nonStandardGroups[dieType].count++;
          nonStandardGroups[dieType].results.push(result);
          nonStandardGroups[dieType].subtotal += result;
          console.log(`Updated non-standard group for ${dieType}, new subtotal = ${nonStandardGroups[dieType].subtotal}`);
        }
        total += result;
      }
    }
  });
  
  // For percentile dice, use the computed total from dice-logic
  if (diceTypes.includes('d00')) {
    total = computeTotal();
  }
  
  console.log('Final nonStandardGroups:', JSON.stringify(nonStandardGroups, null, 2));
  console.log('Final total:', total);
  
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
 * @param {boolean} autoRoll - Whether to automatically roll the die after adding
 * @returns {object} - Information about the roll for animation
 */
export function rollSpecificDie(dieType, autoRoll = true) {
  console.log(`[DEBUG] rollSpecificDie(${dieType}, ${autoRoll}) - start`);
  
  // Don't allow non-standard dice to be added via this function
  if (!['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType)) {
    console.warn(`Invalid standard die type: ${dieType}`);
    return false;
  }
  
  // Check if we have a percentile roll and clear it first
  if (hasPercentileDie()) {
    console.log(`[DEBUG] Percentile die detected, clearing pool`);
    clearDicePool();
  }
  
  // Add die to pool
  console.log(`[DEBUG] Adding ${dieType} to pool`);
  addDie(dieType);
  
  if (autoRoll) {
    // Roll just this die (don't re-roll all dice)
    const result = rollDie(parseInt(dieType.slice(1), 10));
    console.log(`[DEBUG] Rolled ${dieType}: ${result}`);
    addRollResult(result);
    
    // Update the input display
    console.log(`[DEBUG] Updating input display`);
    updateDisplay(prepareDisplayData());
    
    // Get all current dice types and results
    const allDiceTypes = getSelectedDice();
    const allResults = getCurrentRolls();
    const total = computeTotal();
    
    console.log(`[DEBUG] All dice: ${allDiceTypes.join(', ')}`);
    console.log(`[DEBUG] All results: ${allResults.join(', ')}`);
    console.log(`[DEBUG] Total: ${total}`);
    
    // Return info about all dice, not just the latest one
    const rollInfo = {
      diceToAnimate: [dieType], // Only animate the new die
      results: allResults,      // Include all results
      diceTypes: allDiceTypes,  // Include all dice types
      total: total
    };
    console.log(`[DEBUG] Returning rollInfo:`, rollInfo);
    return rollInfo;
  } else {
    // Just add to pool without rolling (for double-click quick add)
    console.log(`[DEBUG] autoRoll is false, just updating display`);
    updateDisplay(prepareDisplayData());
    return null;
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
  
  // Return the properly structured roll info
  return {
    diceToAnimate: ['d00'],  // Always animate the d00 for percentile
    results,
    diceTypes: ['d00'],      // Specify the dice type
    total
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
  clearAnimationSubtotals(); // Clear animation display state
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
  const appletEl = document.getElementById('dice-applet');
  if (appletEl) {
    appletEl.style.left = defaultAppletPosition.left;
    appletEl.style.top = defaultAppletPosition.top;
    appletEl.style.transform = defaultAppletPosition.transform;
    
    // Update last position
    lastPosition = {
      left: appletEl.style.left,
      top: appletEl.style.top,
      transform: appletEl.style.transform
    };
  }
}

/**
 * Show the applet without changing its position
 */
export function showApplet() {
  const appletEl = document.getElementById('dice-applet');
  if (appletEl) {
    appletEl.style.display = 'flex';
    return true;
  }
  return false;
}

/**
 * Enhanced version of minimizeApplet that properly saves state
 */
export function minimizeApplet() {
  const appletEl = document.getElementById('dice-applet');
  if (appletEl) {
    // Store current position before hiding
    lastPosition = {
      left: appletEl.style.left || defaultAppletPosition.left,
      top: appletEl.style.top || defaultAppletPosition.top,
      transform: appletEl.style.transform || defaultAppletPosition.transform
    };
    
    // Hide the applet
    appletEl.style.display = 'none';
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
  const appletEl = document.getElementById('dice-applet');
  if (appletEl) {
    const isHidden = appletEl.style.display === 'none';
    
    if (isHidden) {
      // Show the applet
      appletEl.style.display = 'flex';
      
      // Center if requested, otherwise restore to last position
      if (centerIfShowing) {
        centerApplet();
      } else {
        // Restore previous position
        appletEl.style.left = lastPosition.left;
        appletEl.style.top = lastPosition.top;
        appletEl.style.transform = lastPosition.transform;
      }
      
      return true; // Now visible
    } else {
      // Save position before hiding
      lastPosition = {
        left: appletEl.style.left || defaultAppletPosition.left,
        top: appletEl.style.top || defaultAppletPosition.top,
        transform: appletEl.style.transform || defaultAppletPosition.transform
      };
      
      // Hide the applet
      appletEl.style.display = 'none';
      return false; // Now hidden
    }
  }
  return false;
}

/**
 * Reset the applet to its initial state
 * @param {boolean} clearAll - Whether to clear dice pool, results, and modifier
 * @param {boolean} centerPosition - Whether to reset position to center
 * @param {boolean} hideApplet - Whether to minimize the applet
 */
export function resetApplet(clearAll = true, centerPosition = true, hideApplet = true) {
  // Clear dice pool and results if requested
  if (clearAll) {
    // Clear all state
    clearDicePool(); // This clears dice pool and animation subtotals
    resetState(); // This resets ALL state to initial values
    
    // Update display with cleared state
    updateDisplay(prepareDisplayData());
    
    // Reset d10 percentile state
    resetD10State();
    
    // Clear input field if it exists
    const inputEl = document.getElementById('dice-input');
    if (inputEl) {
      inputEl.textContent = '';
    }
  }
  
  // Reset position if requested
  if (centerPosition) {
    centerApplet();
  }
  
  // Hide applet if requested
  if (hideApplet) {
    minimizeApplet();
  }
  
  // Return true to indicate success
  return true;
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
    return triggerPercentileRoll('notation');
  }
  
  // Check for non-standard dice patterns
  if (nonStandardSet.has(notation.trim().toLowerCase())) {
    console.log('Non-standard dice pattern detected: 1d100 -> treating as d100');
    
    // Clear the current dice pool
    clearDice();
    clearResults();
    
    // Add as non-standard d100
    const dieType = 'd100';
    addDie(dieType);
    
    // Roll as a regular d100
    const result = rollDie(100);
    addRollResult(result);
    
    // Update display
    updateDisplay(prepareDisplayData());
    
    const durationMs = animateDiceIcons([dieType]);
    animateResults(prepareAnimationData([result], [dieType]), durationMs);
    updateResults(prepareResultsData([result], [dieType], getModifier()));
    
    return {
      diceToAnimate: [dieType],
      results: [result],
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
      clearResults(); // Clear previous results before rolling again
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
  clearResults(); // Also clear results to prevent accumulation
  
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
  console.log(`[DEBUG] animateDiceRoll() - start`, rollInfo);
  
  if (!rollInfo) {
    console.warn(`[DEBUG] No roll info provided to animateDiceRoll`);
    return 0;
  }
  
  const { diceToAnimate, results, diceTypes, total } = rollInfo;
  
  console.log(`[DEBUG] Extracted from rollInfo:`);
  console.log(`[DEBUG] diceToAnimate:`, diceToAnimate);
  console.log(`[DEBUG] results:`, results);
  console.log(`[DEBUG] diceTypes (if provided):`, diceTypes);
  console.log(`[DEBUG] total:`, total);
  
  // Get current selected dice and modifier for proper display
  const selectedDice = diceTypes || getSelectedDice();
  const modifier = getModifier();
  
  console.log(`[DEBUG] Current state from API:`)
  console.log(`[DEBUG] selectedDice:`, selectedDice);
  console.log(`[DEBUG] modifier:`, modifier);
  
  // Start animation sequence
  console.log(`[DEBUG] Starting dice icon animations`);
  const durationMs = animateDiceIcons(diceToAnimate);
  
  // Update the animations
  console.log(`[DEBUG] Starting result animations`);
  animateResults({
    rolls: results,
    diceTypes: diceToAnimate,
    total
  }, durationMs);
  
  // Prepare and update the results display
  console.log(`[DEBUG] Preparing results data`);
  const resultsData = prepareResultsData(results, selectedDice, modifier);
  console.log(`[DEBUG] Updating results display with:`, resultsData);
  updateResults(resultsData);
  
  console.log(`[DEBUG] animateDiceRoll completed, returning duration: ${durationMs}ms`);
  return durationMs;
}

/**
 * Single entry point for all percentile dice functionality
 * @param {string} triggerType - How the percentile was triggered ('double-click', 'long-press', 'notation', 'shift-click')
 * @returns {Object} Roll information for animation
 */
export function triggerPercentileRoll(triggerType) {
    console.log(`[DEBUG] Percentile roll triggered by: ${triggerType}`);
    return activatePercentileMode(triggerType);
}

/**
 * Activates percentile mode on the d10 die
 * @param {string} triggerType - How the percentile was triggered
 * @returns {Object} Roll information for animation
 */
export function activatePercentileMode(triggerType) {
    console.log(`[DEBUG] Activating percentile mode via ${triggerType}`);
    
    const d10ButtonEl = document.querySelector('.die-button[data-die="d10"]');
    if (!d10ButtonEl) {
        console.warn('[DEBUG] d10 button not found');
        return false;
    }
    
    // Clear existing dice and set up percentile roll
    clearDicePool();
    addDie('d00');
    
    // Update display with percentile mode
    updateDisplay({
        selectedDice: getSelectedDice(),
        modifier: getModifier(),
        isPercentile: true
    });
    
    // Handle UI feedback
    const isFirstActivation = !d10ButtonEl.classList.contains('percentile-active');
    
    // Keep CSS classes for fallback
    if (isFirstActivation) {
        d10ButtonEl.classList.remove('percentile-active');
        void d10ButtonEl.offsetWidth; // Force reflow
        d10ButtonEl.classList.add('percentile-active', 'first-animation');
        
        if (!d10ButtonEl.classList.contains('has-rolled-once')) {
            d10ButtonEl.classList.add('has-rolled-once');
        }
    }
    
    // Use new physics-based animation alongside CSS
    animateD10(d10ButtonEl, true, isFirstActivation);
    
    // Roll and return animation info
    return rollPercentileDie();
}

/**
 * Roll a custom die using the number input
 * Uses the number from the number buttons to create a custom die
 * @param {string} numberValue - The number value from the number buttons
 * @returns {Object} Roll information for the custom die
 */
export function rollCustomDie(numberValue) {
    const sides = parseInt(numberValue, 10);
    
    // Validate the input
    if (isNaN(sides) || sides <= 0) {
        console.error(`Invalid number of sides: ${sides}`);
        return null;
    }
    
    console.log(`Rolling custom die with ${sides} sides`);
    
    // Use the existing non-standard die rolling function
    return rollNonStandardDie(sides);
} 