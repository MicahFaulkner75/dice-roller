/*
* DISPLAY MANAGEMENT
*
* This file handles updating all visual displays in the dice roller interface.
* It is responsible for refreshing the input area, modifier displays, and results
* based on data passed to it from the core logic layer.
*
* This file:
* 1. Updates the main input display with provided dice selection
* 2. Formats and displays dice groups with proper styling
* 3. Manages modifier display in both input and results areas
* 4. Updates the results display with provided roll values
* 5. Handles special display cases like percentile mode
*/

/**
 * Update the input display and modifier areas
 * @param {Object} displayData - Object containing display information
 * @param {Array} displayData.selectedDice - Currently selected dice
 * @param {number} displayData.modifier - Current modifier value
 * @param {boolean} displayData.isPercentile - Whether in percentile mode
 */
export function updateDisplay({ selectedDice, modifier, isPercentile }) {
  const diceInput = document.getElementById('dice-input');
  const modifierOverlay = document.getElementById('modifier-overlay');
  const inputModifierDisplay = document.querySelector('.input-modifier-display');
  const resultsModifier = document.querySelector('.results-modifier');
  
  // Update input area
  if (diceInput) {
    // Check for percentile roll first
    if (isPercentile) {
      diceInput.innerHTML = '00';
    } else if (selectedDice.length > 0) {
      // Group dice by type for display
      const diceCounts = {};
      selectedDice.forEach(die => {
        diceCounts[die] = (diceCounts[die] || 0) + 1;
      });
      
      // Sort dice by their numeric value
      const sortedDice = Object.keys(diceCounts).sort((a, b) => {
        const aValue = parseInt(a.slice(1), 10);
        const bValue = parseInt(b.slice(1), 10);
        return aValue - bValue;
      });
      
      // Create colored spans for each die group
      const parts = [];
      sortedDice.forEach((die, index) => {
        if (index > 0) parts.push(' + ');
        parts.push(`<span class="${die}-result">${diceCounts[die]}${die}</span>`);
      });
      diceInput.innerHTML = parts.join('');
    } else {
      diceInput.innerHTML = '';
    }
  }
  
  // Format modifier text with explicit +0 when modifier is 0
  const modifierText = modifier === 0 ? '+0' : (modifier > 0 ? `+${modifier}` : `${modifier}`);
  
  // Update all modifier displays
  if (modifierOverlay) modifierOverlay.textContent = modifierText;
  if (inputModifierDisplay) inputModifierDisplay.textContent = modifierText;
  if (resultsModifier) resultsModifier.textContent = modifierText;
}

/**
 * Update the results area with provided roll results
 * @param {Object} resultData - Object containing roll results
 * @param {Array} resultData.standardResults - Array of standard dice results
 * @param {Object} resultData.nonStandardGroups - Grouped non-standard dice results
 * @param {number} resultData.total - Total value of all rolls
 */
export function updateResults({ standardResults, nonStandardGroups, total }) {
  const diceResultsContainer = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  const nonStandardResultsEl = document.getElementById('non-standard-results');
  
  if (!diceResultsContainer || !resultsTotalEl) {
    console.error('Could not find result areas');
    return;
  }
  
  // First add non-standard dice to their special container if it exists
  if (nonStandardResultsEl && Object.keys(nonStandardGroups).length > 0) {
    // Clear the non-standard results container
    nonStandardResultsEl.innerHTML = '';
    
    Object.entries(nonStandardGroups).forEach(([dieType, data]) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'non-standard-result-item';
      
      // Format as "NdX: total [roll1, roll2, ...]"
      const notation = `${data.count}${dieType}`;
      const rollsText = `[${data.results.join(', ')}]`;
      const displayText = `${notation}: ${data.subtotal} ${rollsText}`;
      resultItem.textContent = displayText;
      
      resultItem.dataset.die = dieType;
      resultItem.dataset.group = notation;
      resultItem.title = `Group of ${data.count} ${dieType} dice. Total: ${data.subtotal}`;
      
      nonStandardResultsEl.appendChild(resultItem);
    });
  } else if (nonStandardResultsEl) {
    // Clear non-standard results if there are none
    nonStandardResultsEl.innerHTML = '';
  }
  
  // Then display standard dice in the grid
  if (standardResults.length > 0) {
    // Create a container for standard results
    const standardContainer = document.createElement('div');
    standardContainer.className = 'results-grid';
    
    standardResults.forEach(({ dieType, result }) => {
      const rollBox = document.createElement('div');
      rollBox.className = 'roll-box';
      rollBox.textContent = result;
      rollBox.dataset.die = dieType;
      standardContainer.appendChild(rollBox);
    });
    
    // Clear and update the dice results container
    diceResultsContainer.innerHTML = '';
    diceResultsContainer.appendChild(standardContainer);
  } else {
    // Clear standard results if there are none
    diceResultsContainer.innerHTML = '';
  }
  
  // Update total
  const totalValue = resultsTotalEl.querySelector('.total-value');
  if (totalValue) {
    totalValue.textContent = total;
  }
}