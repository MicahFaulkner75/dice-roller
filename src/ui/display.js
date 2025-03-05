import { state } from '../state';
import { computeNotation, computeTotal } from '../dice-logic';
import { formatModifier, formatDiceInput } from '../utils/formatting';

export function updateDisplay() {
  const notation = computeNotation();
  const diceInput = document.getElementById('dice-input');
  const modifierOverlay = document.getElementById('modifier-overlay');
  
  if (diceInput) {
    // Always show modifier in input, even when zero
    const modifierText = state.modifier >= 0 ? `+${state.modifier}` : `${state.modifier}`;
    diceInput.innerHTML = notation ? `${notation} <span class="modifier-display">${modifierText}</span>` : 
                                   `<span class="modifier-display">${modifierText}</span>`;
  }
  
  if (modifierOverlay) {
    // Always show + for zero and positive numbers
    modifierOverlay.textContent = state.modifier >= 0 ? `+${state.modifier}` : `${state.modifier}`;
  }
  
  updateResults();
}

function updateResults() {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (resultsRollsEl) {
    // Create grid of results with die-specific colors
    // Use the index from selectedDice to maintain order
    const gridHTML = state.currentRolls.map((roll, index) => {
      const dieType = state.selectedDice[index];  // Get corresponding die type
      return `<div class="result-number result-${dieType}">${roll}</div>`;
    }).join('');
    
    // Always show modifier
    resultsRollsEl.innerHTML = gridHTML + 
      `<div class="modifier-display">${state.modifier >= 0 ? '+' : ''}${state.modifier}</div>`;
  }
  
  if (resultsTotalEl) {
    resultsTotalEl.innerHTML = `
      <div style="font-weight:bold; font-size:16px; text-align:center;">TOTAL</div>
      <div style="font-weight:bold; font-size:18px; text-align:center; margin-top:2px;">
        ${computeTotal()}
      </div>`;
  }
}