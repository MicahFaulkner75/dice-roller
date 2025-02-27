import { state } from '../state';
import { computeNotation, computeTotal } from '../dice-logic';
import { formatModifier, formatDiceInput } from '../utils/formatting';

export function updateDisplay() {
  const notation = computeNotation();
  const diceInput = document.getElementById('dice-input');
  const modifierOverlay = document.getElementById('modifier-overlay');
  
  if (diceInput) {
    diceInput.innerHTML = notation ? formatDiceInput(notation, state.modifier) : '';
  }
  if (modifierOverlay) {
    modifierOverlay.textContent = state.modifier > 0 ? `+${state.modifier}` : state.modifier || '0';
  }
  
  updateResults();
}

function updateResults() {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (resultsRollsEl) {
    resultsRollsEl.innerHTML = state.currentRolls.join(' + ') + formatModifier(state.modifier);
  }
  
  if (resultsTotalEl) {
    resultsTotalEl.innerHTML = `
      <div style="font-weight:bold; font-size:16px; text-align:center;">TOTAL:</div>
      <div style="font-weight:bold; font-size:18px; text-align:center; margin-top:2px;">
        ${computeTotal()}
      </div>`;
  }
}