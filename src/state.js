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
*/

// Private state object - no longer directly exported
const _state = {
  selectedDice: [],
  currentRolls: [],
  modifier: 0,
  lastTotal: undefined
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
 * Check if a percentile die is active
 * @returns {boolean} - True if a percentile die is currently selected
 */
export function hasPercentileDie() {
  // Check if there's exactly one die and it's a percentile die (d00 ONLY)
  // We no longer consider d100 as a percentile die to allow 1d100 to work as a non-standard die
  return _state.selectedDice.length === 1 && _state.selectedDice[0] === 'd00';
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
 * Clear the last total value
 */
export function clearLastTotal() {
  _state.lastTotal = undefined;
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
    lastTotal: _state.lastTotal
  };
}