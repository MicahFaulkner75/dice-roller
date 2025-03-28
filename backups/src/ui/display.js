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
  const diceInputEl = document.getElementById('dice-input');
  if (diceInputEl) {
    // Add scroll event listener
    diceInputEl.addEventListener('scroll', handleInputScroll);
    console.log('Initialized dice input scroll handler');
  }
}

/**
 * Handle scroll events in the dice input
 * Updates the visual indication based on scroll position
 * @param {Event} event - The scroll event
 */
function handleInputScroll(event) {
  const diceInputEl = event.target;
  
  // Calculate if we're at the start, middle or end of scrolling
  const atStart = diceInputEl.scrollLeft < 10;
  const atEnd = Math.abs(diceInputEl.scrollWidth - diceInputEl.clientWidth - diceInputEl.scrollLeft) < 10;
  
  // Update classes based on scroll position
  diceInputEl.classList.toggle('scroll-at-start', atStart);
  diceInputEl.classList.toggle('scroll-at-end', atEnd);
  diceInputEl.classList.toggle('scroll-middle', !atStart && !atEnd);
  
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
  const diceInputEl = document.getElementById('dice-input');
  const modifierOverlayEl = document.getElementById('modifier-overlay');
  const inputModifierEl = document.querySelector('.input-modifier-display');
  const resultsModifierEl = document.getElementById('results-modifier');
  const resultsFieldEl = document.querySelector('.results-field');
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  const nonStandardResultsEl = document.querySelector('.non-standard-results');
  
  // Store original width to detect expansion
  const originalWidth = diceInputEl ? diceInputEl.offsetWidth : 0;
  
  // Update input area
  if (diceInputEl) {
    // Check for percentile roll first
    if (isPercentile) {
      diceInputEl.innerHTML = '00';
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
      diceInputEl.innerHTML = parts.join('');
      
      // Reset scroll position to the start (left)
      diceInputEl.scrollLeft = 0;
      
      // Force width to remain consistent
      if (diceInputEl.offsetWidth > originalWidth) {
        diceInputEl.style.width = originalWidth + 'px';
      }
      
      // Add scroll indicator class if content is scrollable
      if (diceInputEl.scrollWidth > diceInputEl.clientWidth) {
        diceInputEl.classList.add('scrollable');
        diceInputEl.classList.add('scroll-at-start');
        diceInputEl.classList.remove('scroll-at-end');
        diceInputEl.classList.remove('scroll-middle');
      } else {
        diceInputEl.classList.remove('scrollable');
        diceInputEl.classList.remove('scroll-at-start');
        diceInputEl.classList.remove('scroll-at-end');
        diceInputEl.classList.remove('scroll-middle');
      }
    } else {
      diceInputEl.innerHTML = '';
      // Remove all scroll classes when empty
      diceInputEl.classList.remove('scrollable');
      diceInputEl.classList.remove('scroll-at-start');
      diceInputEl.classList.remove('scroll-at-end');
      diceInputEl.classList.remove('scroll-middle');
    }
  }
  
  // Format modifier text with explicit +0 when modifier is 0
  const modifierText = modifier === 0 ? '+0' : (modifier > 0 ? `+${modifier}` : `${modifier}`);
  
  // Update all modifier displays
  if (modifierOverlayEl) modifierOverlayEl.textContent = modifierText;
  if (inputModifierEl) inputModifierEl.textContent = modifierText;
  if (resultsModifierEl) resultsModifierEl.textContent = modifierText;
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
  const resultsFieldEl = document.querySelector('.results-field');
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  const nonStandardResultsEl = document.querySelector('.non-standard-results');
  const resultsModifierEl = document.getElementById('results-modifier');
  
  if (!resultsFieldEl || !resultsRollsEl || !resultsTotalEl || !nonStandardResultsEl) {
    console.warn(`[DEBUG] One or more results containers not found in DOM`);
    return;
  }
  
  console.log(`[DEBUG] Updating results display elements found in DOM`);
  
  // Update the modifier display
  if (resultsModifierEl) {
    const modifier = data.modifier || 0;
    resultsModifierEl.textContent = modifier > 0 ? `+${modifier}` : (modifier < 0 ? modifier.toString() : "+0");
    console.log(`[DEBUG] Updated modifier display: ${resultsModifierEl.textContent}`);
  }
  
  // Clear and update non-standard dice results
  nonStandardResultsEl.innerHTML = '';
  const nonStandardGroups = data.nonStandardGroups || {};
  
  console.log(`[DEBUG] Updating non-standard groups:`, nonStandardGroups);
  Object.keys(nonStandardGroups).forEach(dieType => {
    const group = nonStandardGroups[dieType];
    const container = document.createElement('div');
    container.className = 'non-standard-result-item';
    
    // Call animation function from dice-animations.js
    console.log(`[DEBUG] Calling animateNonStandardResult for ${dieType}`);
    animateNonStandardResult(container, group, dieType, 2000);
    
    nonStandardResultsEl.appendChild(container);
  });
  
  // Update the overlay height based on the number of non-standard dice groups
  updateOverlayHeight(Object.keys(nonStandardGroups).length);
  
  // Clear and update standard dice results 
  resultsRollsEl.innerHTML = '';
  const standardResults = data.standardResults || [];
  
  console.log(`[DEBUG] Updating standard results:`, standardResults);
  
  // Create a grid container for the results
  const resultsGridEl = document.createElement('div');
  resultsGridEl.className = 'results-grid';
  
  standardResults.forEach(result => {
    const rollBox = document.createElement('div');
    rollBox.className = 'roll-box';
    
    // Create a span for the roll value to ensure proper styling
    const rollValue = document.createElement('span');
    rollValue.className = 'roll-value';
    
    // Special handling for percentile results
    if (typeof result.value === 'object' && result.value.type) {
      // This is a percentile component
      rollBox.dataset.die = result.value.type;  // d10-tens or d10-ones
      rollValue.textContent = result.value.value;
    } else {
      // Standard die result
      rollBox.dataset.die = result.dieType;
      rollValue.textContent = result.value;
    }
    
    // Append the roll value span to the roll box
    rollBox.appendChild(rollValue);
    resultsGridEl.appendChild(rollBox);
    console.log(`[DEBUG] Added result: ${rollBox.dataset.die} = ${rollValue.textContent}`);
  });
  
  // Append the grid to the results container
  resultsRollsEl.appendChild(resultsGridEl);
  
  // Update total value
  const totalValue = resultsTotalEl.querySelector('.total-value');
  if (totalValue) {
    totalValue.textContent = data.total;
    console.log(`[DEBUG] Updated total value: ${totalValue.textContent}`);
  }
  
  console.log(`[DEBUG] updateResults completed`);
}