import { state } from '../state';
import { computeNotation, computeTotal } from '../dice-logic';
import { formatModifier, formatDiceInput } from '../utils/formatting';

export function updateDisplay() {
  const notation = computeNotation();
  const diceInput = document.getElementById('dice-input');
  const inputModifierDisplay = document.querySelector('.input-modifier-display');
  const resultsModifierDisplay = document.querySelector('.results-modifier');
  const modifierOverlay = document.getElementById('modifier-overlay');
  
  // Update input area
  if (diceInput) {
    diceInput.innerHTML = notation || '';
  }
  
  // Always show modifier with +0 default
  if (inputModifierDisplay) {
    inputModifierDisplay.textContent = state.modifier === 0 ? '+0' : (state.modifier > 0 ? `+${state.modifier}` : state.modifier);
    inputModifierDisplay.style.display = 'flex';
  }
  
  // Always show modifier with +0 default in results
  if (resultsModifierDisplay) {
    resultsModifierDisplay.textContent = state.modifier === 0 ? '+0' : (state.modifier > 0 ? `+${state.modifier}` : state.modifier);
    resultsModifierDisplay.style.display = 'flex';
  }

  // Update modifier overlay
  if (modifierOverlay) {
    modifierOverlay.textContent = state.modifier === 0 ? '+0' : (state.modifier > 0 ? `+${state.modifier}` : state.modifier);
  }
  
  updateResults();
}

function updateResults() {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  const resultsRight = document.querySelector('.results-right');
  
  if (resultsRollsEl) {
    // Clear existing results
    resultsRollsEl.innerHTML = '';
    
    // Create boxes for each roll only (no modifier)
    state.currentRolls.forEach((roll, index) => {
      const rollBox = document.createElement('div');
      rollBox.className = 'roll-box';
      rollBox.textContent = roll;
      resultsRollsEl.appendChild(rollBox);
    });

    // Add or update modifier display if it doesn't exist
    let modifierDisplay = resultsRight.querySelector('.results-modifier');
    if (!modifierDisplay) {
      modifierDisplay = document.createElement('div');
      modifierDisplay.className = 'results-modifier';
      resultsRight.appendChild(modifierDisplay);
    }
    
    // Always show modifier with +0 default
    modifierDisplay.textContent = state.modifier === 0 ? '+0' : (state.modifier > 0 ? `+${state.modifier}` : state.modifier);
    modifierDisplay.style.display = 'flex';
  }
  
  if (resultsTotalEl) {
    const totalValue = resultsTotalEl.querySelector('.total-value');
    if (totalValue) {
      totalValue.textContent = computeTotal();
    }
  }
}