/*
* STATE MANAGEMENT
*
* This file manages the application's state and provides functions to modify it.
* It is responsible for maintaining the current dice selection, roll results, and modifier values.
*
* This file:
* 1. Defines the central state object (private)
* 2. Provides getter/setter methods for all state properties
* 3. Offers validation for state changes
* 4. Provides utility functions for state operations
* 5. Implements a consistent pattern for state updates
* 6. Manages fudge dice mode for GM roll manipulation
*
* Last updated: March 20, 2025
*/

// Private state object - no longer directly exported
const _state = {
  selectedDice: [],
  currentRolls: [],
  modifier: 0,
  lastTotal: undefined,
  lastSubtotals: {}, // Add storage for last subtotals by die type
  fudgeMode: null    // Add new fudge mode property (null, 'critical', 'high', 'low', 'minimum')
};

// For backward compatibility - will be deprecated in future versions
// This allows existing code to continue working while we transition
export const state = _state;

/**
 * GETTERS
 */

/**
 * Get all selected dice
 * @returns {Array} - Copy of the selected dice array
 */
export function getSelectedDice() {
  return [..._state.selectedDice];
}

/**
 * Get current roll results
 * @returns {Array} - Copy of the current rolls array
 */
export function getCurrentRolls() {
  return [..._state.currentRolls];
}

/**
 * Get current modifier value
 * @returns {number} - The current modifier
 */
export function getModifier() {
  return _state.modifier;
}

/**
 * Get last total (for percentile rolls)
 * @returns {number|undefined} - The last total value if available
 */
export function getLastTotal() {
  return _state.lastTotal;
}

/**
 * Get the last subtotal for a specific non-standard die type (FOR ANIMATION DISPLAY ONLY)
 * @param {string} dieType - Die type (e.g., 'd30')
 * @returns {string} - Last subtotal value or "0" if not set
 */
export function getAnimationSubtotal(dieType) {
  return _state.lastSubtotals[dieType] || "0";
}

/**
 * Check if a percentile die is active
 * @returns {boolean} - True if a percentile die is currently selected
 */
export function hasPercentileDie() {
  // Check if there's exactly one die and it's a percentile die (d00 ONLY)
  // We no longer consider d100 as a percentile die to allow 1d100 to work as a non-standard die
  return _state.selectedDice.length === 1 && _state.selectedDice[0] === 'd00';
}

/**
 * Check if a die is a standard die (d4, d6, d8, d10, d12, d20)
 * @param {string} die - Die notation (e.g. 'd6')
 * @returns {boolean} True if the die is a standard die
 */
export function isStandardDie(die) {
  const standardDice = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
  return standardDice.includes(die.toLowerCase());
}

/**
 * Check if a die is a percentile die (d00)
 * @param {string} die - Die notation (e.g. 'd00')
 * @returns {boolean} True if the die is a percentile die
 */
export function isPercentileDie(die) {
  return die.toLowerCase() === 'd00';
}

/**
 * Get current fudge mode
 * @returns {string|null} - Current fudge mode or null if not active
 */
export function getFudgeMode() {
  return _state.fudgeMode;
}

/**
 * SETTERS
 */

/**
 * Set the modifier value
 * @param {number} value - The new modifier value
 * @throws {Error} - If value is not a number
 */
export function setModifier(value) {
  if (isNaN(value)) {
    console.warn(`Invalid modifier value: ${value}`);
    return;
  }
  _state.modifier = parseInt(value, 10);
}

/**
 * Set the last total value (for percentile rolls)
 * @param {number} value - The total to set
 */
export function setLastTotal(value) {
  if (isNaN(value)) {
    console.warn(`Invalid last total value: ${value}`);
    return;
  }
  _state.lastTotal = parseInt(value, 10);
}

/**
 * Set the last subtotal for a specific non-standard die type (FOR ANIMATION DISPLAY ONLY)
 * This value should NOT be used for calculations, only for showing animation transitions
 * @param {string} dieType - Die type (e.g., 'd30')
 * @param {string|number} value - Subtotal value to store
 */
export function setAnimationSubtotal(dieType, value) {
  _state.lastSubtotals[dieType] = value.toString();
}

/**
 * Clear the last total value
 */
export function clearLastTotal() {
  _state.lastTotal = undefined;
}

/**
 * Clear all stored animation subtotals
 */
export function clearAnimationSubtotals() {
  _state.lastSubtotals = {};
}

/**
 * Set the fudge mode for dice rolls
 * @param {string|null} mode - 'critical', 'high', 'low', 'minimum', or null
 * @returns {boolean} - Whether the mode was set successfully
 */
export function setFudgeMode(mode) {
  // Validate the mode
  const validModes = [null, 'critical', 'high', 'low', 'minimum'];
  if (!validModes.includes(mode)) {
    console.warn(`Invalid fudge mode: ${mode}`);
    return false;
  }
  
  _state.fudgeMode = mode;
  return true;
}

/**
 * Clear the current fudge mode
 */
export function clearFudgeMode() {
  _state.fudgeMode = null;
}

/**
 * STATE OPERATIONS
 */

/**
 * Add a die to the selection
 * @param {string} die - The die type to add (e.g., 'd6', 'd20')
 * @throws {Error} - If die doesn't follow the dX format
 */
export function addDie(die) {
  if (!die || typeof die !== 'string' || !die.startsWith('d')) {
    console.warn(`Invalid die type: ${die}`);
    return;
  }
  _state.selectedDice.push(die);
}

/**
 * Add a roll result
 * @param {number|object} result - The roll result to add
 */
export function addRollResult(result) {
  _state.currentRolls.push(result);
}

/**
 * Set multiple roll results at once
 * @param {Array} results - The array of roll results
 */
export function setRollResults(results) {
  if (!Array.isArray(results)) {
    console.warn('Roll results must be an array');
    return;
  }
  _state.currentRolls = [...results];
}

/**
 * Replace the selected dice array
 * @param {Array} dice - The new array of selected dice
 */
export function setSelectedDice(dice) {
  if (!Array.isArray(dice)) {
    console.warn('Selected dice must be an array');
    return;
  }
  _state.selectedDice = [...dice];
}

/**
 * Clear all selected dice
 */
export function clearDice() {
  _state.selectedDice = [];
}

/**
 * Clear all roll results
 */
export function clearResults() {
  _state.currentRolls = [];
}

/**
 * Reset all state to initial values
 */
export function resetState() {
  _state.selectedDice = [];
  _state.currentRolls = [];
  _state.modifier = 0;
  _state.lastTotal = undefined;
  _state.lastSubtotals = {}; // Also reset the subtotals object
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * Groups and sorts dice by nomenclature for display
 * @returns {Object} - Object with grouped dice counts and sorted dice array
 */
export function getSortedDiceNotation() {
  // Group dice by type
  const diceCounts = {};
  _state.selectedDice.forEach(die => {
    diceCounts[die] = (diceCounts[die] || 0) + 1;
  });
  
  // Sort dice types by their numeric value
  const sortedDice = Object.keys(diceCounts).sort((a, b) => {
    const aValue = parseInt(a.slice(1), 10);
    const bValue = parseInt(b.slice(1), 10);
    return aValue - bValue;
  });
  
  return {
    counts: diceCounts,
    sorted: sortedDice
  };
}

/**
 * Get a snapshot of the current state
 * Useful for debugging or saving state
 * @returns {Object} - Copy of the current state
 */
export function getStateSnapshot() {
  return {
    selectedDice: [..._state.selectedDice],
    currentRolls: [..._state.currentRolls],
    modifier: _state.modifier,
    lastTotal: _state.lastTotal,
    fudgeMode: _state.fudgeMode // Add fudge mode to the snapshot
  };
}