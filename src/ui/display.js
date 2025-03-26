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
* 6. Manages scrollable results area for both standard and non-standard dice
* 7. Updates dynamic overlay height based on non-standard dice count (Added 2023-05-29)
*/

import { animateNonStandardResult } from '../animations/dice-animations';

/**
 * Initialize the display module
 * Sets up event listeners and initializes display elements
 */
export function initDisplayModule() {
  // Set up scroll handling for the dice input
  const diceInput = document.getElementById('dice-input');
  if (diceInput) {
    // Add scroll event listener
    diceInput.addEventListener('scroll', handleInputScroll);
    console.log('Initialized dice input scroll handler');
  }
}

/**
 * Handle scroll events in the dice input
 * Updates the visual indication based on scroll position
 * @param {Event} event - The scroll event
 */
function handleInputScroll(event) {
  const diceInput = event.target;
  
  // Calculate if we're at the start, middle or end of scrolling
  const atStart = diceInput.scrollLeft < 10;
  const atEnd = Math.abs(diceInput.scrollWidth - diceInput.clientWidth - diceInput.scrollLeft) < 10;
  
  // Update classes based on scroll position
  diceInput.classList.toggle('scroll-at-start', atStart);
  diceInput.classList.toggle('scroll-at-end', atEnd);
  diceInput.classList.toggle('scroll-middle', !atStart && !atEnd);
  
  console.log(`Input scroll position: ${atStart ? 'start' : (atEnd ? 'end' : 'middle')}`);
}

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
  const extractedResultsModifier = document.getElementById('extracted-results-modifier');
  
  // Store original width to detect expansion
  const originalWidth = diceInput ? diceInput.offsetWidth : 0;
  
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
      
      // Use innerHTML method which preserves layout constraints better
      const parts = [];
      sortedDice.forEach((die, index) => {
        if (index > 0) parts.push(' + ');
        parts.push(`<span class="${die}-result">${diceCounts[die]}${die}</span>`);
      });
      diceInput.innerHTML = parts.join('');
      
      // Reset scroll position to the start (left)
      diceInput.scrollLeft = 0;
      
      // Force width to remain consistent
      if (diceInput.offsetWidth > originalWidth) {
        diceInput.style.width = originalWidth + 'px';
      }
      
      // Add scroll indicator class if content is scrollable
      if (diceInput.scrollWidth > diceInput.clientWidth) {
        diceInput.classList.add('scrollable');
        diceInput.classList.add('scroll-at-start');
        diceInput.classList.remove('scroll-at-end');
        diceInput.classList.remove('scroll-middle');
      } else {
        diceInput.classList.remove('scrollable');
        diceInput.classList.remove('scroll-at-start');
        diceInput.classList.remove('scroll-at-end');
        diceInput.classList.remove('scroll-middle');
      }
    } else {
      diceInput.innerHTML = '';
      // Remove all scroll classes when empty
      diceInput.classList.remove('scrollable');
      diceInput.classList.remove('scroll-at-start');
      diceInput.classList.remove('scroll-at-end');
      diceInput.classList.remove('scroll-middle');
    }
  }
  
  // Format modifier text with explicit +0 when modifier is 0
  const modifierText = modifier === 0 ? '+0' : (modifier > 0 ? `+${modifier}` : `${modifier}`);
  
  // Update all modifier displays, including the extracted one
  if (modifierOverlay) modifierOverlay.textContent = modifierText;
  if (inputModifierDisplay) inputModifierDisplay.textContent = modifierText;
  if (extractedResultsModifier) extractedResultsModifier.textContent = modifierText;
}

/**
 * Updates the overlay height based on the number of non-standard dice
 * @param {number} itemCount - Number of non-standard dice results
 */
function updateOverlayHeight(itemCount) {
  // Calculate height: 22px per item (changed from 23px)
  const height = itemCount * 22;
  
  // Apply the height with CSS variable for easier maintenance
  document.documentElement.style.setProperty('--overlay-height', `${height}px`);
  
  console.log(`[DEBUG] Updated overlay height to ${height}px based on ${itemCount} non-standard dice`);
}

/**
 * Update the results area with roll results
 * @param {Object} data - Results data
 * @param {Array} data.standardResults - Standard dice results
 * @param {Object} data.nonStandardGroups - Non-standard dice grouped results
 * @param {number} data.modifier - Modifier value
 * @param {number} data.total - Total roll value
 */
export function updateResults(data) {
  console.log(`[DEBUG] updateResults called with:`, data);
  
  if (!data) {
    console.warn(`[DEBUG] No data provided to updateResults`);
    return;
  }
  
  // Get results containers
  const resultsField = document.querySelector('.results-field');
  const resultsRolls = document.getElementById('results-rolls');
  const resultsTotal = document.getElementById('results-total');
  const nonStandardResults = document.querySelector('.non-standard-results');
  
  // Update the selector to use the extracted results modifier
  const extractedResultsModifier = document.getElementById('extracted-results-modifier');
  
  if (!resultsField || !resultsRolls || !resultsTotal || !nonStandardResults) {
    console.warn(`[DEBUG] One or more results containers not found in DOM`);
    return;
  }
  
  console.log(`[DEBUG] Updating results display elements found in DOM`);
  
  // Update the extracted modifier display instead of the original
  if (extractedResultsModifier) {
    const modifier = data.modifier || 0;
    extractedResultsModifier.textContent = modifier > 0 ? `+${modifier}` : (modifier < 0 ? modifier.toString() : "+0");
    console.log(`[DEBUG] Updated extracted modifier display: ${extractedResultsModifier.textContent}`);
  }
  
  // Clear and update non-standard dice results
  nonStandardResults.innerHTML = '';
  const nonStandardGroups = data.nonStandardGroups || {};
  
  console.log(`[DEBUG] Updating non-standard groups:`, nonStandardGroups);
  Object.keys(nonStandardGroups).forEach(dieType => {
    const group = nonStandardGroups[dieType];
    const container = document.createElement('div');
    container.className = 'non-standard-result-item';
    
    // Call animation function from dice-animations.js
    console.log(`[DEBUG] Calling animateNonStandardResult for ${dieType}`);
    animateNonStandardResult(container, group, dieType, 2000);
    
    nonStandardResults.appendChild(container);
  });
  
  // Update the overlay height based on the number of non-standard dice groups
  updateOverlayHeight(Object.keys(nonStandardGroups).length);
  
  // Clear and update standard dice results 
  resultsRolls.innerHTML = '';
  const standardResults = data.standardResults || [];
  
  console.log(`[DEBUG] Updating standard results:`, standardResults);
  standardResults.forEach(result => {
    const rollBox = document.createElement('div');
    rollBox.className = 'roll-box';
    
    // Special handling for percentile results
    if (typeof result.value === 'object' && result.value.type) {
      // This is a percentile component
      rollBox.dataset.die = result.value.type;  // d10-tens or d10-ones
      rollBox.textContent = result.value.value;
    } else {
      // Standard die result
      rollBox.dataset.die = result.dieType;
      rollBox.textContent = result.value;
    }
    
    resultsRolls.appendChild(rollBox);
    console.log(`[DEBUG] Added result: ${rollBox.dataset.die} = ${rollBox.textContent}`);
  });
  
  // Update total value
  const totalValue = resultsTotal.querySelector('.total-value');
  if (totalValue) {
    totalValue.textContent = data.total;
    console.log(`[DEBUG] Updated total value: ${totalValue.textContent}`);
  }
  
  console.log(`[DEBUG] updateResults completed`);
}