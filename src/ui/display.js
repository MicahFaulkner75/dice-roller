import { state } from '../state';
import { computeNotation, computeTotal } from '../dice-logic';
import { formatModifier, formatDiceInput } from '../utils/formatting';

export function updateDisplay() {
  const notation = computeNotation();
  const diceInput = document.getElementById('dice-input');
  const modifierOverlay = document.getElementById('modifier-overlay');
  const inputModifierDisplay = document.querySelector('.input-modifier-display');
  const resultsModifier = document.querySelector('.results-modifier');
  
  // Update input area
  if (diceInput) {
    // Check for percentile roll first
    if (state.selectedDice.length === 1 && 
        (state.selectedDice[0] === 'd00' || state.selectedDice[0] === 'd100')) {
      diceInput.innerHTML = '00';
    } else if (state.selectedDice.length > 0) {
      // Handle normal dice display
      const diceCounts = {};
      state.selectedDice.forEach(die => {
        diceCounts[die] = (diceCounts[die] || 0) + 1;
      });
      
      // Create colored spans for each die group
      const parts = [];
      Object.entries(diceCounts).forEach(([die, count], index) => {
        if (index > 0) parts.push(' + ');
        parts.push(`<span class="${die}-result">${count}${die}</span>`);
      });
      diceInput.innerHTML = parts.join('');
    } else {
      diceInput.innerHTML = '';
    }
  }
  
  // Format modifier text with explicit +0 when modifier is 0
  const modifierText = state.modifier === 0 ? '+0' : (state.modifier > 0 ? `+${state.modifier}` : `${state.modifier}`);
  
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

function updateResults() {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (resultsRollsEl) {
    // Clear existing results
    resultsRollsEl.innerHTML = '';
    
    // Check if this is a percentile roll
    const isPercentile = state.selectedDice.length === 1 && state.selectedDice[0] === 'd00';
    
    if (isPercentile && Array.isArray(state.currentRolls)) {
      // Handle percentile display
      state.currentRolls.forEach(roll => {
        const rollBox = document.createElement('div');
        rollBox.className = 'roll-box';
        rollBox.textContent = roll.value;
        rollBox.dataset.die = roll.type;  // d10-tens or d10-ones
        resultsRollsEl.appendChild(rollBox);
      });
    } else if (state.currentRolls.length > 0) {
      // Normal dice display
      state.currentRolls.forEach((roll, index) => {
        const rollBox = document.createElement('div');
        rollBox.className = 'roll-box';
        rollBox.textContent = roll;
        rollBox.dataset.die = state.selectedDice[index];
        resultsRollsEl.appendChild(rollBox);
      });
    }
  }
  
  if (resultsTotalEl) {
    const totalValue = resultsTotalEl.querySelector('.total-value');
    if (totalValue) {
      // Always compute total, which will include the modifier
      const total = computeTotal();
      totalValue.textContent = total;
      
      // Clear lastTotal after use
      if (state.lastTotal !== undefined) {
        state.lastTotal = undefined;
      }
    }
  }
}