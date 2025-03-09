import { state } from '../state';
import { computeNotation, computeTotal } from '../dice-logic';
import { formatModifier, formatDiceInput } from '../utils/formatting';

export function updateDisplay() {
  const notation = computeNotation();
  const diceInput = document.getElementById('dice-input');
  const modifierOverlay = document.getElementById('modifier-overlay');
  const inputModifierDisplay = document.querySelector('.input-modifier-display');
  const resultsModifier = document.querySelector('.results-modifier');
  
  // Update input area with colored dice notation
  if (diceInput) {
    if (notation) {
      // Split notation into parts and color-code each die type
      const parts = notation.split(' + ');
      const coloredParts = parts.map(part => {
        const dieMatch = part.match(/(\d+)(d\d+)/);
        if (dieMatch) {
          const [_, count, dieType] = dieMatch;
          return `<span class="${dieType}-result">${count}${dieType}</span>`;
        }
        return part;
      });
      diceInput.innerHTML = coloredParts.join(' + ');
    } else {
      diceInput.innerHTML = '';
    }
  }
  
  // Always show +0 for all modifier displays when modifier is 0
  const modifierText = state.modifier === 0 ? '+0' : (state.modifier > 0 ? `+${state.modifier}` : state.modifier);
  
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
    
    // Create boxes for each roll with die type
    state.currentRolls.forEach((roll, index) => {
      const rollBox = document.createElement('div');
      rollBox.className = 'roll-box';
      rollBox.textContent = roll;
      rollBox.dataset.die = state.selectedDice[index];
      resultsRollsEl.appendChild(rollBox);
    });
  }
  
  if (resultsTotalEl) {
    const totalValue = resultsTotalEl.querySelector('.total-value');
    if (totalValue) {
      totalValue.textContent = computeTotal();
    }
  }
}