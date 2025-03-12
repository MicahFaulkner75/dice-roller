/*
* DISPLAY MANAGEMENT
*
* This file handles updating all visual displays in the dice roller interface.
* It is responsible for refreshing the input area, modifier displays, and results
* based on the current application state. It now uses the state API for accessing
* state data rather than direct manipulation.
*
* This file:
* 1. Updates the main input display with current dice selection (updateDisplay)
* 2. Formats and displays dice groups with proper styling
* 3. Manages modifier display in both input and results areas
* 4. Updates the results display with current roll values (updateResults)
* 5. Handles special display cases like percentile mode
* 6. Uses state API functions to retrieve all state information
*/

import { 
  getSelectedDice, 
  getCurrentRolls, 
  getModifier, 
  getLastTotal,
  hasPercentileDie,
  clearLastTotal,
  getSortedDiceNotation,
  isStandardDie,
  isPercentileDie
} from '../state';
import { computeNotation, computeTotal } from '../dice-logic';
import { formatModifier, formatDiceInput } from '../utils/formatting';

export function updateDisplay() {
  const diceInput = document.getElementById('dice-input');
  const modifierOverlay = document.getElementById('modifier-overlay');
  const inputModifierDisplay = document.querySelector('.input-modifier-display');
  const resultsModifier = document.querySelector('.results-modifier');
  
  // Update input area
  if (diceInput) {
    // Check for percentile roll first
    if (hasPercentileDie()) {
      diceInput.innerHTML = '00';
    } else if (getSelectedDice().length > 0) {
      // Get sorted dice for display
      const { counts, sorted } = getSortedDiceNotation();
      
      // Create colored spans for each die group
      const parts = [];
      sorted.forEach((die, index) => {
        if (index > 0) parts.push(' + ');
        parts.push(`<span class="${die}-result">${counts[die]}${die}</span>`);
      });
      diceInput.innerHTML = parts.join('');
    } else {
      diceInput.innerHTML = '';
    }
  }
  
  // Get current modifier value
  const modifier = getModifier();
  
  // Format modifier text with explicit +0 when modifier is 0
  const modifierText = modifier === 0 ? '+0' : (modifier > 0 ? `+${modifier}` : `${modifier}`);
  
  // Update all modifier displays
  if (modifierOverlay) {
    modifierOverlay.textContent = modifierText;
  }
  
  if (inputModifierDisplay) {
    inputModifierDisplay.textContent = modifierText;
  }
  
  if (resultsModifier) {
    resultsModifier.textContent = modifierText;
  }
  
  updateResults();
}

/**
 * Update the results area with current roll results
 */
export function updateResults() {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (!resultsRollsEl || !resultsTotalEl) {
    console.error('Could not find result areas');
    return;
  }
  
  // Clear previous results
  resultsRollsEl.innerHTML = '';
  
  // Get current state values
  const selectedDice = getSelectedDice();
  const currentRolls = getCurrentRolls();
  const lastTotal = getLastTotal();
  
  // Check if the current rolls contain percentile dice
  const hasPercentile = currentRolls.some(roll => 
    typeof roll === 'object' && (roll.type === 'd10-tens' || roll.type === 'd10-ones')
  );
  
  // Check if we need to process percentile dice special case
  if (hasPercentile) {
    // Handle percentile display
    currentRolls.forEach(roll => {
      const rollBox = document.createElement('div');
      rollBox.className = 'roll-box';
      rollBox.textContent = roll.value;
      rollBox.dataset.die = roll.type;  // d10-tens or d10-ones
      resultsRollsEl.appendChild(rollBox);
    });
  } else {
    // Regular dice processing - maintain original order
    const nonStandardResults = [];
    const standardResults = [];
    
    // NEW: Object to store grouped non-standard dice
    const nonStandardGroups = {};
    
    // Process dice in their original order
    selectedDice.forEach((dieType, index) => {
      const result = currentRolls[index];
      
      // Skip undefined results
      if (result === undefined) return;
      
      // Use the utility functions to determine die type
      if (isStandardDie(dieType)) {
        standardResults.push({ dieType, result, originalIndex: index });
      } else if (isPercentileDie(dieType) && hasPercentileDie()) {
        // Only treat as percentile if it's a pure percentile roll
        // This case should be handled by the hasPercentile branch above
        // Skip this die since it's already handled in the percentile case
        return;
      } else {
        // This is a non-standard die (including d100 in mixed rolls)
        nonStandardResults.push({ dieType, result, originalIndex: index });
        
        // Group non-standard dice by type
        if (!nonStandardGroups[dieType]) {
          nonStandardGroups[dieType] = {
            count: 0,
            nomenclature: dieType,
            results: [],
            subtotal: 0
          };
        }
        
        // Add this die to its group
        nonStandardGroups[dieType].count++;
        nonStandardGroups[dieType].results.push(result);
        nonStandardGroups[dieType].subtotal += result;
      }
    });
    
    // DEBUG: Log the grouped non-standard dice
    console.log('Non-standard groups:', nonStandardGroups);
    
    // Sort by original index to preserve input order
    nonStandardResults.sort((a, b) => a.originalIndex - b.originalIndex);
    standardResults.sort((a, b) => a.originalIndex - b.originalIndex);
    
    // Display non-standard dice first with special format "dX=Y"
    nonStandardResults.forEach(({ dieType, result }) => {
      const rollBox = document.createElement('div');
      rollBox.className = 'roll-box nonstandard';
      // Format non-standard dice as "dX=Y"
      rollBox.textContent = `${dieType}=${result}`;
      rollBox.dataset.die = dieType;
      resultsRollsEl.appendChild(rollBox);
      
      // DEBUG: Add data attribute to show which group this die belongs to
      if (nonStandardGroups[dieType]) {
        rollBox.dataset.group = `${nonStandardGroups[dieType].count}${dieType}`;
        rollBox.title = `Part of group: ${nonStandardGroups[dieType].count}${dieType}, total: ${nonStandardGroups[dieType].subtotal}`;
      }
    });
    
    // Display standard dice with normal format
    standardResults.forEach(({ dieType, result }) => {
      const rollBox = document.createElement('div');
      rollBox.className = 'roll-box';
      rollBox.textContent = result;
      rollBox.dataset.die = dieType;
      resultsRollsEl.appendChild(rollBox);
    });
  }
  
  // Update total
  const totalValue = resultsTotalEl.querySelector('.total-value');
  if (totalValue) {
    // Always compute total, which will include the modifier
    const total = computeTotal();
    totalValue.textContent = total;
    
    // Clear lastTotal after use
    if (lastTotal !== undefined) {
      clearLastTotal();
    }
  }
}